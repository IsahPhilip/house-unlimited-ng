<?php
/**
 * Privacy policy page template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$content = [
    'Your privacy is important to House Unlimited Nigeria. This policy outlines how we collect, use, and safeguard your personal information when you use our platform.',
    'We collect information such as your name, email address, and property preferences when you create an account or inquire about a listing.',
    'Your data is used to provide personalized property recommendations, facilitate communication with agents, and improve our services.',
    'We do not share your personal data with third parties for marketing purposes. We use industry-standard security measures to protect your sensitive information.',
];
?>

<div class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-12">Privacy Policy</h1>
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <?php foreach ($content as $paragraph) : ?>
                <p class="text-gray-600 text-sm leading-relaxed"><?php echo esc_html($paragraph); ?></p>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php
get_footer();
