<?php
/**
 * Terms page template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$content = [
    'House Unlimited & Land Services Nigeria Ltd (RC 1600988) operates the House Unlimited Nigeria platform. By accessing this platform, you agree to comply with and be bound by the following terms and conditions. If you do not agree, please do not use our services.',
    'Our services provided through the platform, including property listings, investment insights, and buyer guidance, are for informational purposes. While we strive for accuracy, users must verify all details independently.',
    'User accounts are personal and should not be shared. You are responsible for maintaining the confidentiality of your sign-in credentials.',
    'All content and branding are property of House Unlimited Nigeria or its licensors. Unauthorized commercial use is strictly prohibited.',
];
?>

<div class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-12">Terms &amp; Conditions</h1>
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <?php foreach ($content as $paragraph) : ?>
                <p class="text-gray-600 text-sm leading-relaxed"><?php echo esc_html($paragraph); ?></p>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php
get_footer();
