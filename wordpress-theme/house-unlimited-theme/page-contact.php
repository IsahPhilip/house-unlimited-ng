<?php
/**
 * Contact page template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$page_content = '';
if (have_posts()) {
    the_post();
    $page_content = trim(get_the_content());
}

if ($page_content !== '') {
    echo '<main class="animate-in fade-in duration-500">';
    echo apply_filters('the_content', $page_content);
    echo '</main>';
    get_footer();
    return;
}

$contact_info = hu_get_contact_info();
$badge = function_exists('get_field') ? get_field('contact_badge', 'option') : '';
$title = function_exists('get_field') ? get_field('contact_title', 'option') : '';
$subtitle = function_exists('get_field') ? get_field('contact_subtitle', 'option') : '';

if (!$badge) {
    $badge = 'Get In Touch';
}
if (!$title) {
    $title = 'Contact Us';
}
if (!$subtitle) {
    $subtitle = 'Have questions about a property or want to list your own? Our team is here to help you every step of the way.';
}

$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['hu_contact_nonce'])) {
    if (!wp_verify_nonce($_POST['hu_contact_nonce'], 'hu_contact_form')) {
        $error = 'Security check failed. Please try again.';
    } else {
        $name = sanitize_text_field($_POST['name'] ?? '');
        $email = sanitize_email($_POST['email'] ?? '');
        $subject = sanitize_text_field($_POST['subject'] ?? '');
        $message = sanitize_textarea_field($_POST['message'] ?? '');
        $phone = sanitize_text_field($_POST['phone'] ?? '');
        $type = sanitize_text_field($_POST['type'] ?? 'general');

        if (!$name || !$email || !$subject || !$message) {
            $error = 'Please fill in all required fields.';
        } elseif (!is_email($email)) {
            $error = 'Please enter a valid email address.';
        } else {
            $admin_email = get_option('admin_email');
            $full_message = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nType: {$type}\n\nMessage:\n{$message}";
            $headers = ['Reply-To: ' . $email];

            $mail_sent = wp_mail($admin_email, $subject, $full_message, $headers);
            $db_saved = false;

            global $wpdb;
            $table = $wpdb->prefix . 'hu_inquiries';
            $table_exists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table;
            if ($table_exists) {
                $db_saved = (bool) $wpdb->insert($table, [
                    'property_id' => 0,
                    'user_id' => get_current_user_id() ?: null,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'message' => $message,
                    'inquiry_type' => $type ?: 'contact',
                    'status' => 'pending',
                    'created_at' => current_time('mysql'),
                    'updated_at' => current_time('mysql'),
                ]);
            }

            if ($mail_sent || $db_saved) {
                $success = true;
            } else {
                $error = 'Failed to send message. Please try again.';
            }
        }
    }
}
?>

<div class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
            <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold"><?php echo esc_html($badge); ?></p>
            <h1 class="text-4xl font-bold text-gray-900">Contact <span class="text-gray-400 font-light italic">Us</span></h1>
            <p class="text-gray-500 mt-4 max-w-2xl mx-auto"><?php echo esc_html($subtitle); ?></p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div class="lg:col-span-1 space-y-8">
                <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                            <i data-lucide="phone" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                            <p class="font-bold text-gray-900"><?php echo esc_html($contact_info['phone']); ?></p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                            <i data-lucide="mail" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                            <p class="font-bold text-gray-900"><?php echo esc_html($contact_info['email']); ?></p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                            <i data-lucide="map-pin" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Office Location</p>
                            <p class="font-bold text-gray-900 text-sm"><?php echo esc_html($contact_info['address']); ?></p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-3xl text-white">
                    <h4 class="font-bold mb-4">Working Hours</h4>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between border-b border-white/10 pb-2">
                            <span class="text-gray-400">Monday - Friday</span>
                            <span class="font-bold">08 AM - 05 PM</span>
                        </div>
                        <div class="flex justify-between border-b border-white/10 pb-2">
                            <span class="text-gray-400">Saturday</span>
                            <span class="font-bold text-teal-400">Closed</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Sunday</span>
                            <span class="font-bold text-teal-400">Closed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <div class="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                    <h3 class="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>

                    <?php if ($success) : ?>
                        <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-green-800">Message Sent Successfully!</h4>
                                    <p class="text-green-600 text-sm mt-1">Thank you for contacting us. We'll get back to you soon!</p>
                                </div>
                            </div>
                        </div>
                    <?php elseif ($error) : ?>
                        <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <p class="text-red-600 text-sm"><?php echo esc_html($error); ?></p>
                        </div>
                    <?php endif; ?>

                    <form class="grid grid-cols-1 md:grid-cols-2 gap-6" method="post">
                        <?php wp_nonce_field('hu_contact_form', 'hu_contact_nonce'); ?>
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                            <input type="text" name="name" placeholder="Your full name" class="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none" required>
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
                            <input type="email" name="email" placeholder="you@houseunlimitednigeria.com" class="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none" required>
                        </div>
                        <div class="md:col-span-2 space-y-2">
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Subject *</label>
                            <input type="text" name="subject" placeholder="What can we help you with?" class="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none" required>
                        </div>
                        <div class="md:col-span-2 space-y-2">
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Message *</label>
                            <textarea name="message" rows="6" placeholder="Please provide details about your inquiry..." class="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none resize-none" required></textarea>
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number (Optional)</label>
                            <input type="tel" name="phone" placeholder="+234 904 375 2708" class="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none">
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Inquiry Type</label>
                            <select name="type" class="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none">
                                <option value="general">General Inquiry</option>
                                <option value="property_inquiry">Property Inquiry</option>
                                <option value="partnership">Partnership</option>
                                <option value="complaint">Complaint</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <button type="submit" class="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-200 uppercase tracking-widest text-xs">
                                Send Message
                            </button>
                            <p class="text-xs text-gray-500 mt-3">We typically respond within 24 hours. For urgent matters, please call us directly.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
get_footer();
