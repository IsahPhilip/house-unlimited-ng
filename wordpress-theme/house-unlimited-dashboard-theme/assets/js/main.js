// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // ========== DARK MODE TOGGLE ==========
    const darkToggle = document.getElementById('darkmode');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark');
        if (darkToggle) darkToggle.checked = true;
    }

    if (darkToggle) {
        darkToggle.onchange = () => {
            document.body.classList.toggle('dark');
            const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            
            // Also update the cookie for PHP
            document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
        };
    }

    // ========== UNREAD MESSAGES BADGE ==========
    const updateUnreadBadge = () => {
        fetch(window.BASE_URL + '/api/unread_count.php')
            .then(response => {
                if (!response.ok) {
                    // Throw an error to be handled by the catch block.
                    // This is especially for 401 Unauthorized errors, but will catch any non-ok response.
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const badges = document.querySelectorAll('.msg-badge');
                badges.forEach(badge => {
                    const count = data.count || 0;
                    badge.textContent = count > 0 ? count : '';
                    badge.style.display = count > 0 ? 'flex' : 'none';
                });
            })
            .catch(error => {
                // We expect this to fail with a 401 on pages where the user is not logged in.
                // We also expect it to fail if the session expires.
                // So, we don't log the error to the console, we just hide the badge.
                const badges = document.querySelectorAll('.msg-badge');
                badges.forEach(badge => {
                    badge.style.display = 'none';
                });
            });
    };

    // Only run the badge update if there are badge elements on the page.
    // This prevents pointless API calls on public pages like login, register, etc.
    if (document.querySelectorAll('.msg-badge').length > 0) {
        updateUnreadBadge();
        setInterval(updateUnreadBadge, 15000);
    }

    // ========== NIGERIAN NAIRA FORMATTER ==========
    window.formatNGN = (amount) => {
        return new Intl.NumberFormat('en-NG', { 
            style: 'currency', 
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // ========== SIDEBAR DROPDOWNS ==========
    const initSidebarDropdowns = () => {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        const setDropdownState = (toggle, isExpanded) => {
            const hasSubmenuParent = toggle.closest('.has-submenu');
            if (!hasSubmenuParent) return;

            const submenu = hasSubmenuParent.querySelector('.submenu');
            if (!submenu) return;

            toggle.classList.toggle('expanded', isExpanded);
            submenu.classList.toggle('expanded', isExpanded);
            toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        };

        const closeSiblingDropdowns = (toggle) => {
            const hasSubmenuParent = toggle.closest('.has-submenu');
            if (!hasSubmenuParent || !hasSubmenuParent.parentElement) return;

            hasSubmenuParent.parentElement
                .querySelectorAll(':scope > .has-submenu > .dropdown-toggle')
                .forEach((otherToggle) => {
                    if (otherToggle !== toggle) {
                        setDropdownState(otherToggle, false);
                    }
                });
        };

        const closeAllDropdowns = () => {
            nav.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
                setDropdownState(toggle, false);
            });
        };

        // Sync initial and resized states without re-binding listeners.
        nav.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
            const hasSubmenuParent = toggle.closest('.has-submenu');
            if (!hasSubmenuParent) return;

            const submenu = hasSubmenuParent.querySelector('.submenu');
            if (!submenu) return;

            if (!submenu.id) {
                submenu.id = `sidebar-submenu-${Math.random().toString(36).slice(2, 10)}`;
            }
            toggle.setAttribute('aria-controls', submenu.id);
            toggle.setAttribute('aria-haspopup', 'true');

            const isExpanded = toggle.classList.contains('expanded') ||
                submenu.classList.contains('expanded') ||
                toggle.classList.contains('active');
            setDropdownState(toggle, isExpanded);
        });

        if (nav.dataset.dropdownBound === 'true') {
            return;
        }

        nav.addEventListener('click', (e) => {
            const toggle = e.target.closest('.dropdown-toggle');
            if (!toggle || !nav.contains(toggle)) return;

            e.preventDefault();
            e.stopPropagation();

            const willExpand = !toggle.classList.contains('expanded');
            setDropdownState(toggle, willExpand);
            if (willExpand) {
                closeSiblingDropdowns(toggle);
            }
        });

        nav.addEventListener('keydown', (e) => {
            const toggle = e.target.closest('.dropdown-toggle');
            if (!toggle || !nav.contains(toggle)) return;

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const willExpand = !toggle.classList.contains('expanded');
                setDropdownState(toggle, willExpand);
                if (willExpand) {
                    closeSiblingDropdowns(toggle);
                }
            }

            if (e.key === 'Escape') {
                e.preventDefault();
                setDropdownState(toggle, false);
                toggle.focus();
            }
        });

        // Close dropdowns when clicking outside (desktop only)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) return;
            if (e.target.closest('.dropdown-toggle') || e.target.closest('.submenu')) return;
            closeAllDropdowns();
        });

        nav.dataset.dropdownBound = 'true';
    };

    // ========== SIDEBAR TOGGLE (COLLAPSE/EXPAND) ==========
    const initSidebarToggle = () => {
        const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
        if (!sidebarToggleBtn) return;

        sidebarToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the collapsed state
            document.body.classList.toggle('sidebar-collapsed');
            
            // Save state to localStorage
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
            
            // Close all dropdowns when collapsing
            if (isCollapsed) {
                document.querySelectorAll('.dropdown-toggle.expanded').forEach(toggle => {
                    toggle.classList.remove('expanded');
                    const submenu = toggle.closest('.has-submenu').querySelector('.submenu');
                    if (submenu) {
                        submenu.classList.remove('expanded');
                    }
                });
            }
        });

        // Load initial state
        const sidebarState = localStorage.getItem('sidebarCollapsed');
        if (sidebarState === 'true') {
            document.body.classList.add('sidebar-collapsed');
        }
    };

    // ========== KPI / STAT CARD LINKS ==========
    function initStatCardLinks() {
        document.querySelectorAll('.stat-card[data-href]').forEach((card) => {
            if (card.dataset.cardLinkBound === 'true') return;

            if (!card.hasAttribute('tabindex')) {
                card.tabIndex = 0;
            }
            if (!card.hasAttribute('role')) {
                card.setAttribute('role', 'link');
            }

            const navigate = () => {
                const href = card.dataset.href;
                if (href) window.location.href = href;
            };

            card.addEventListener('click', (e) => {
                // Don't hijack clicks on interactive elements inside the card.
                if (e.target.closest('a,button,input,select,textarea,label,[data-no-card-nav]')) return;
                navigate();
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate();
                }
            });

            card.dataset.cardLinkBound = 'true';
        });
    }
    // ========== THEME BUTTONS ==========
    const initThemeButtons = () => {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                
                // Update theme
                document.body.classList.remove('light', 'dark');
                document.body.classList.add(theme);
                localStorage.setItem('theme', theme);
                document.cookie = `theme=${theme}; path=/; max-age=31536000`;
                
                // Update button states
                themeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update dark mode toggle if it exists
                if (darkToggle) {
                    darkToggle.checked = theme === 'dark';
                }
            });
        });
    };

    // ========== MOBILE SIDEBAR HANDLING ==========
    const initMobileSidebar = () => {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            // Ensure click is outside sidebar AND not on a mobile toggle button
            if (window.innerWidth <= 992 && 
                !sidebar.contains(e.target) && 
                !e.target.closest('.mobile-sidebar-toggle') && // Exclude mobile toggle
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        // Toggle sidebar on hamburger button click (including .mobile-sidebar-toggle)
        const hamburgerButtons = document.querySelectorAll('.hamburger-btn, .mobile-menu-btn, .mobile-sidebar-toggle');
        hamburgerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click from immediately closing
                sidebar.classList.toggle('active');
                // When mobile sidebar opens/closes, ensure desktop collapsed state is off
                document.body.classList.remove('sidebar-collapsed'); 
                localStorage.setItem('sidebarCollapsed', 'false');
            });
        });
        
        // Close mobile sidebar only for real navigation links.
        // Keep it open when tapping dropdown toggles so submenu items remain accessible.
        document.querySelectorAll('.nav .menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth > 992) return;

                const isDropdownToggle = item.classList.contains('dropdown-toggle');
                const hasPlaceholderHref = item.getAttribute('href') === '#';
                if (isDropdownToggle || hasPlaceholderHref) {
                    return;
                }

                sidebar.classList.remove('active');
            });
        });
    };

    // ========== INITIALIZE EVERYTHING ==========
    initStatCardLinks();
    initSidebarDropdowns();
    initSidebarToggle();
    initThemeButtons();
    initMobileSidebar();

    // ========== INVESTOR OFFERS MODAL (COMPONENT) ==========
    // Auto-initialize if the component exists on the page.
    if (document.getElementById('investorOffersModal') && typeof window.initInvestorOffersModal === 'function') {
        window.initInvestorOffersModal();
    }

    // Confirm dialog
    window.showConfirm = (message, confirmCallback, cancelCallback = null) => {
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'confirm-dialog';
        confirmDialog.innerHTML = `
            <div class="confirm-content">
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="btn btn-secondary confirm-cancel">Cancel</button>
                    <button class="btn btn-danger confirm-ok">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmDialog);
        
        // Show dialog
        setTimeout(() => {
            confirmDialog.classList.add('show');
        }, 10);
        
        // Button events
        confirmDialog.querySelector('.confirm-ok').addEventListener('click', () => {
            confirmDialog.classList.remove('show');
            setTimeout(() => {
                if (confirmDialog.parentNode) {
                    confirmDialog.parentNode.removeChild(confirmDialog);
                }
            }, 300);
            if (confirmCallback) confirmCallback();
        });
        
        confirmDialog.querySelector('.confirm-cancel').addEventListener('click', () => {
            confirmDialog.classList.remove('show');
            setTimeout(() => {
                if (confirmDialog.parentNode) {
                    confirmDialog.parentNode.removeChild(confirmDialog);
                }
            }, 300);
            if (cancelCallback) cancelCallback();
        });
        
        // Close on backdrop click
        confirmDialog.addEventListener('click', (e) => {
            if (e.target === confirmDialog) {
                confirmDialog.classList.remove('show');
                setTimeout(() => {
                    if (confirmDialog.parentNode) {
                        confirmDialog.parentNode.removeChild(confirmDialog);
                    }
                }, 300);
                if (cancelCallback) cancelCallback();
            }
        });
    };

    // ========== RESPONSIVE HANDLING ==========
    const handleResize = () => {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        if (window.innerWidth <= 992) {
            // On mobile, ensure sidebar is hidden and desktop collapsed state is removed
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-collapsed');
        } else {
            // On desktop, apply localStorage state for sidebar collapse
            // Ensure mobile 'active' class is removed
            sidebar.classList.remove('active'); 

            const sidebarState = localStorage.getItem('sidebarCollapsed');
            if (sidebarState === 'true') {
                document.body.classList.add('sidebar-collapsed');
            } else {
                document.body.classList.remove('sidebar-collapsed');
            }
            // Reinitialize dropdowns to ensure correct state after resize
            // This is needed because 'body.sidebar-collapsed' state might change
            initSidebarDropdowns(); 
        }
    };

    // Initial resize handling
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // ========== GLOBAL EVENT LISTENERS ==========
    // Prevent dropdown propagation on submenu items
    document.addEventListener('click', (e) => {
        if (e.target.closest('.submenu .menu-item')) {
            e.stopPropagation();
        }
    });
});

// ========== GLOBAL HELPER FUNCTIONS ==========
// Format date
window.formatDate = (dateString, format = 'medium') => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: format === 'short' ? 'short' : 'long',
        day: 'numeric'
    };
    
    if (format === 'full') {
        options.weekday = 'long';
    }
    
    return date.toLocaleDateString('en-NG', options);
};

// Format time
window.formatTime = (dateString, showSeconds = false) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined
    });
};

// Debounce function for performance
window.debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ========== INVESTOR OFFERS MODAL (GLOBAL COMPONENT INITIALIZER) ==========
// Usage:
// - Include the PHP component: inc/components/investor_offers_modal.php (clients only by default)
// - Add any trigger button/link: data-open-investor-offers
// - Optionally open via query param: ?offers=1 (configurable via component data-attrs)
(function () {
    if (typeof window.initInvestorOffersModal === 'function') return;

    const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[s]));

    const joinUrl = (base, path) => {
        const b = String(base || '').replace(/\/+$/, '');
        const p = String(path || '');
        if (!b) return p.startsWith('/') ? p : '/' + p;
        return b + (p.startsWith('/') ? p : '/' + p);
    };

    const fetchJsonSafe = async (url, options = {}) => {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            // Most common case: redirected to a login HTML page or forbidden HTML.
            throw new Error(`NON_JSON_${response.status}`);
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || `HTTP_${response.status}`);
        }
        return data;
    };

    window.initInvestorOffersModal = function initInvestorOffersModal(options = {}) {
        const modalId = options.modalId || 'investorOffersModal';
        const modal = document.getElementById(modalId);
        if (!modal) return;
        if (modal.dataset.bound === 'true') return;

        const body = document.getElementById(options.bodyId || 'investorOffersBody');
        const closeBtn = document.getElementById(options.closeButtonId || 'closeInvestorOffersModal');

        const baseUrl = options.baseUrl || window.BASE_URL || '';
        const offersUrl = joinUrl(baseUrl, '/api/get_upsell_offers.php');
        const redeemUrl = joinUrl(baseUrl, '/api/redeem_upsell.php');

        const autoOpen = (modal.dataset.autoOpen ?? '') !== '0' && (options.autoOpen ?? true);
        const autoOpenDelayMs = parseInt(modal.dataset.autoOpenDelayMs || options.autoOpenDelayMs || '5000', 10);
        const seenTtlMs = parseInt(modal.dataset.seenTtlMs || options.seenTtlMs || String(6 * 60 * 60 * 1000), 10);
        const pollMs = parseInt(modal.dataset.pollMs || options.pollMs || '60000', 10);
        const queryParam = modal.dataset.queryParam || options.queryParam || 'offers';
        const queryValue = String(modal.dataset.queryValue || options.queryValue || '1');

        const state = {
            loading: false,
            lastLoadHadOffers: false
        };

        const modalKey = 'investor_offers_modal_seen_at';

        const openModal = (markSeen = true) => {
            modal.style.display = 'flex';
            if (markSeen) localStorage.setItem(modalKey, String(Date.now()));
        };

        const closeModal = () => {
            modal.style.display = 'none';
        };

        const renderEmpty = (title, desc) => {
            if (!body) return;
            body.innerHTML = `
                <div class="empty-state" style="padding:1.4rem;">
                    <i class="fas fa-tag"></i>
                    <h3>${escapeHtml(title)}</h3>
                    <p>${escapeHtml(desc)}</p>
                </div>
            `;
        };

        const renderOffers = (offers) => {
            if (!body) return;
            body.innerHTML = `
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(270px, 1fr)); gap:0.9rem;">
                    ${offers.map((offer) => `
                        <div class="stat-card" style="text-align:left; border:1px solid var(--border); box-shadow:0 12px 30px rgba(0,0,0,0.08); padding:1.1rem;">
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:0.6rem; margin-bottom:0.4rem;">
                                <strong style="font-size:1rem;">${escapeHtml(offer.campaign_name || 'Investor Deal')}</strong>
                                <span class="badge badge-sale" style="font-size:0.72rem;">INVESTOR DEAL</span>
                            </div>
                            <div style="font-size:0.9rem; font-weight:600; color:var(--primary-dark, #0b4f4f); margin-bottom:0.35rem;">
                                ${escapeHtml(offer.property_title || 'Property')}
                            </div>
                            <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.8rem;">${escapeHtml(offer.property_location || '')}</div>
                            <div style="background:linear-gradient(135deg, rgba(0,85,85,0.08), rgba(0,85,85,0.02)); border:1px solid rgba(0,85,85,0.15); border-radius:10px; padding:0.7rem; margin-bottom:0.75rem;">
                                <div style="display:flex; align-items:baseline; gap:0.5rem;">
                                    <span style="color:var(--text-muted); text-decoration:line-through; font-size:0.88rem;">₦${Number(offer.original_price || 0).toLocaleString()}</span>
                                    <strong style="color:var(--primary); font-size:1.2rem;">₦${Number(offer.discounted_price || 0).toLocaleString()}</strong>
                                </div>
                                <small style="display:block; margin-top:0.25rem;">Initial payment: ₦${Number(offer.initial_payment || 0).toLocaleString()} (${Number(offer.initial_payment_percent || 0)}%)</small>
                            </div>
                            <small style="display:block; margin-bottom:0.8rem; color:var(--text-muted);">Offer ends: ${offer.ends_at ? new Date(String(offer.ends_at).replace(' ', 'T')).toLocaleString('en-NG') : 'N/A'}</small>
                            <button class="action-btn btn-primary js-redeem-upsell" style="width:100%;" data-campaign-id="${Number(offer.campaign_id)}">
                                <i class="fas fa-handshake"></i> Claim Discount
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        const loadOffers = async ({ allowAutoOpen = false } = {}) => {
            if (!body || state.loading) return;
            state.loading = true;

            try {
                const result = await fetchJsonSafe(offersUrl, { credentials: 'include' });
                const offers = (result && result.success && Array.isArray(result.offers)) ? result.offers : [];

                if (offers.length === 0) {
                    state.lastLoadHadOffers = false;
                    renderEmpty('No active investor offers', "When new investor discounts become available, they'll appear here.");
                    return;
                }

                state.lastLoadHadOffers = true;
                renderOffers(offers);

                if (allowAutoOpen && autoOpen) {
                    const lastSeen = Number(localStorage.getItem(modalKey) || 0);
                    const shouldOpen = (Date.now() - lastSeen) > seenTtlMs;
                    if (shouldOpen) {
                        setTimeout(() => openModal(true), autoOpenDelayMs);
                    }
                }
            } catch (e) {
                // If auth expired, don't hard redirect here; keep non-blocking.
                renderEmpty('Failed to load investor offers', 'Please refresh or try again later.');
            } finally {
                state.loading = false;
            }
        };

        const redeemCampaign = async (campaignId) => {
            const id = Number(campaignId);
            if (!id) return;
            if (!confirm('Claim this discounted offer now?')) return;

            try {
                const result = await fetchJsonSafe(redeemUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ campaign_id: id })
                });

                if (!result.success) {
                    if (typeof window.showToast === 'function') {
                        window.showToast('error', 'Upsell Offer', result.message || 'Unable to redeem offer.');
                    }
                    return;
                }

                if (typeof window.showToast === 'function') {
                    window.showToast('success', 'Upsell Offer', 'Offer redeemed. Redirecting...');
                }
                setTimeout(() => {
                    if (result.redirect_url) {
                        window.location.href = result.redirect_url;
                    }
                }, 800);
            } catch (e) {
                if (typeof window.showToast === 'function') {
                    window.showToast('error', 'Upsell Offer', 'Request failed. Please try again.');
                }
            }
        };

        // Bind close controls
        closeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });

        // Backdrop click closes
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Open triggers anywhere on the page
        document.querySelectorAll('[data-open-investor-offers]').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                await loadOffers({ allowAutoOpen: false });
                openModal(true);
            });
        });

        // Redeem buttons (event delegation)
        body?.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-redeem-upsell');
            if (!btn) return;
            redeemCampaign(btn.getAttribute('data-campaign-id'));
        });

        // Query param open (used by KPI cards redirect)
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get(queryParam) === queryValue) {
                setTimeout(async () => {
                    await loadOffers({ allowAutoOpen: false });
                    openModal(true);
                }, autoOpenDelayMs);
            }
        } catch (e) {}

        // Initial load + auto-open logic
        loadOffers({ allowAutoOpen: true });
        if (pollMs > 0) {
            setInterval(() => loadOffers({ allowAutoOpen: false }), pollMs);
        }

        modal.dataset.bound = 'true';
    };
})();
