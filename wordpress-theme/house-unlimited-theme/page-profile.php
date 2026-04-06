<?php
/**
 * User Profile page template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

if (!is_user_logged_in()) {
    ?>
    <section class="py-24 bg-gray-50 min-h-[60vh]">
        <div class="max-w-5xl mx-auto px-4 text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
            <p class="text-gray-600 mb-8">You need an account to access saved properties, reviews, and profile settings.</p>
            <button type="button" data-hu-auth-open="signin" class="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all">
                Sign In
            </button>
        </div>
    </section>
    <?php
    get_footer();
    return;
}

$current_user = wp_get_current_user();
$profile = hu_get_user_profile_data($current_user->ID);
$counts = hu_get_user_activity_counts($current_user->ID);
$active_tab = sanitize_key($_GET['tab'] ?? 'overview');
$allowed_tabs = ['overview', 'properties', 'reviews', 'settings'];
if (!in_array($active_tab, $allowed_tabs, true)) {
    $active_tab = 'overview';
}

$success_message = '';
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['hu_profile_nonce'])) {
    if (!wp_verify_nonce($_POST['hu_profile_nonce'], 'hu_profile_update')) {
        $error_message = 'Security check failed. Please refresh and try again.';
    } else {
        $display_name = sanitize_text_field($_POST['display_name'] ?? $current_user->display_name);
        $phone = sanitize_text_field($_POST['phone'] ?? '');
        $location = sanitize_text_field($_POST['location'] ?? '');
        $bio = sanitize_textarea_field($_POST['bio'] ?? '');
        $pref_email = !empty($_POST['pref_email']);
        $pref_sms = !empty($_POST['pref_sms']);

        $avatar_url = $profile['avatar_url'];
        if (!empty($_FILES['avatar']['name'])) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            $uploaded = wp_handle_upload($_FILES['avatar'], ['test_form' => false]);
            if (!empty($uploaded['error'])) {
                $error_message = $uploaded['error'];
            } else {
                $filetype = wp_check_filetype($uploaded['file']);
                $attachment_id = wp_insert_attachment([
                    'post_mime_type' => $filetype['type'],
                    'post_title' => sanitize_file_name($uploaded['file']),
                    'post_content' => '',
                    'post_status' => 'inherit',
                ], $uploaded['file']);

                if (!is_wp_error($attachment_id)) {
                    wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $uploaded['file']));
                    $avatar_url = wp_get_attachment_url($attachment_id);
                }
            }
        }

        if (!$error_message) {
            wp_update_user([
                'ID' => $current_user->ID,
                'display_name' => $display_name,
            ]);

            hu_update_user_profile_data($current_user->ID, [
                'phone' => $phone,
                'location' => $location,
                'bio' => $bio,
                'avatar_url' => $avatar_url,
                'preferences' => [
                    'email' => $pref_email,
                    'sms' => $pref_sms,
                ],
            ]);

            $current_user = wp_get_current_user();
            $profile = hu_get_user_profile_data($current_user->ID);
            $success_message = 'Profile updated successfully.';
        }
    }
}

$member_since = $current_user->user_registered ? date_i18n('M Y', strtotime($current_user->user_registered)) : 'Not set';
?>

<section class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-6xl mx-auto px-4">
        <div class="bg-white rounded-3xl p-8 shadow-sm mb-10">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div class="relative">
                    <?php if (!empty($profile['avatar_url'])) : ?>
                        <img src="<?php echo esc_url($profile['avatar_url']); ?>" alt="<?php echo esc_attr($current_user->display_name); ?>" class="w-32 h-32 rounded-full object-cover shadow-lg">
                    <?php else : ?>
                        <div class="w-32 h-32 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            <?php echo esc_html(strtoupper(substr($current_user->display_name, 0, 1))); ?>
                        </div>
                    <?php endif; ?>
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2"><?php echo esc_html($current_user->display_name); ?></h1>
                    <p class="text-gray-600 mb-4"><?php echo esc_html($current_user->user_email); ?></p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-teal-600"><?php echo esc_html($counts['wishlist']); ?></div>
                            <div class="text-sm text-gray-600">Saved Properties</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600"><?php echo esc_html($counts['reviews']); ?></div>
                            <div class="text-sm text-gray-600">Reviews</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600"><?php echo esc_html($member_since); ?></div>
                            <div class="text-sm text-gray-600">Member Since</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-amber-600"><?php echo esc_html(get_user_meta($current_user->ID, 'hu_profile_completion', true) ?: '60%'); ?></div>
                            <div class="text-sm text-gray-600">Profile Completion</div>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                        <a href="<?php echo esc_url(wp_logout_url(home_url('/'))); ?>" class="text-red-500 font-semibold hover:underline">Sign Out</a>
                    </div>
                </div>
            </div>
        </div>

        <?php if ($success_message) : ?>
            <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6"><?php echo esc_html($success_message); ?></div>
        <?php endif; ?>
        <?php if ($error_message) : ?>
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"><?php echo esc_html($error_message); ?></div>
        <?php endif; ?>

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div class="border-b border-gray-100 px-6">
                <div class="flex flex-wrap gap-4 py-4 text-sm font-semibold">
                    <?php foreach ($allowed_tabs as $tab_key) : ?>
                        <?php
                        $label = ucfirst($tab_key);
                        $url = add_query_arg('tab', $tab_key, get_permalink());
                        $is_active = $active_tab === $tab_key;
                        ?>
                        <a href="<?php echo esc_url($url); ?>" class="px-4 py-2 rounded-xl <?php echo $is_active ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-50'; ?>">
                            <?php echo esc_html($label); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="p-8">
                <?php if ($active_tab === 'overview') : ?>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-gray-50 rounded-2xl p-6">
                            <h3 class="text-lg font-bold text-gray-900 mb-4">Profile Overview</h3>
                            <p class="text-gray-600 mb-2"><span class="font-semibold text-gray-900">Phone:</span> <?php echo esc_html($profile['phone'] ?: 'Not set'); ?></p>
                            <p class="text-gray-600 mb-2"><span class="font-semibold text-gray-900">Location:</span> <?php echo esc_html($profile['location'] ?: 'Not set'); ?></p>
                            <p class="text-gray-600 mb-2"><span class="font-semibold text-gray-900">Bio:</span> <?php echo esc_html($profile['bio'] ?: 'Not set'); ?></p>
                        </div>
                        <div class="bg-gray-50 rounded-2xl p-6">
                            <h3 class="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                            <p class="text-gray-600 mb-2">
                                Email Notifications: <span class="font-semibold text-gray-900"><?php echo !empty($profile['preferences']['email']) ? 'Enabled' : 'Disabled'; ?></span>
                            </p>
                            <p class="text-gray-600 mb-2">
                                SMS Notifications: <span class="font-semibold text-gray-900"><?php echo !empty($profile['preferences']['sms']) ? 'Enabled' : 'Disabled'; ?></span>
                            </p>
                        </div>
                    </div>
                <?php elseif ($active_tab === 'properties') : ?>
                    <div class="text-center text-gray-600">
                        <p class="text-lg font-semibold text-gray-900 mb-2">Saved Properties</p>
                        <p>Saved properties will appear here once you add items to your wishlist.</p>
                    </div>
                <?php elseif ($active_tab === 'reviews') : ?>
                    <div class="text-center text-gray-600">
                        <p class="text-lg font-semibold text-gray-900 mb-2">Your Reviews</p>
                        <p>Your property reviews will show up here after you submit them.</p>
                    </div>
                <?php else : ?>
                    <form method="post" enctype="multipart/form-data" class="space-y-6">
                        <?php wp_nonce_field('hu_profile_update', 'hu_profile_nonce'); ?>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="display_name">Full Name</label>
                                <input id="display_name" name="display_name" type="text" value="<?php echo esc_attr($current_user->display_name); ?>" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200">
                            </div>
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="phone">Phone</label>
                                <input id="phone" name="phone" type="text" value="<?php echo esc_attr($profile['phone']); ?>" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200">
                            </div>
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="location">Location</label>
                                <input id="location" name="location" type="text" value="<?php echo esc_attr($profile['location']); ?>" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200">
                            </div>
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="avatar">Profile Photo</label>
                                <input id="avatar" name="avatar" type="file" accept="image/*" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" for="bio">Bio</label>
                            <textarea id="bio" name="bio" rows="4" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"><?php echo esc_textarea($profile['bio']); ?></textarea>
                        </div>

                        <div class="bg-gray-50 rounded-2xl p-6">
                            <p class="text-sm font-bold text-gray-900 mb-3">Notification Preferences</p>
                            <label class="flex items-center gap-3 text-gray-600 text-sm mb-2">
                                <input type="checkbox" name="pref_email" <?php checked(!empty($profile['preferences']['email'])); ?> />
                                Email updates about listings and news
                            </label>
                            <label class="flex items-center gap-3 text-gray-600 text-sm">
                                <input type="checkbox" name="pref_sms" <?php checked(!empty($profile['preferences']['sms'])); ?> />
                                SMS notifications about price changes
                            </label>
                        </div>

                        <button type="submit" class="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all">
                            Save Changes
                        </button>
                    </form>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
