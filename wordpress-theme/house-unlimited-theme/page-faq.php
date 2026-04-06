<?php
/**
 * FAQ page template.
 *
 * @package HouseUnlimited
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$faqs = [
    ['question' => 'How do I start the buying process?', 'answer' => 'Share your location, budget, and timeline. Our team will guide you through inspections, documentation, and closing steps.'],
    ['question' => 'Do you offer off-plan developments?', 'answer' => 'Yes. We provide off-plan luxury developments and estate plots with clear milestones and documentation.'],
    ['question' => 'Can I invest from outside Nigeria?', 'answer' => 'Yes. We support diaspora investors with virtual viewings, documentation guidance, and remote updates.'],
    ['question' => 'How do I list a property with House Unlimited Nigeria?', 'answer' => 'Use the Contact page to reach our advisory team. We will review your property and outline next steps.'],
];
?>

<div class="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div class="max-w-3xl mx-auto px-4">
        <div class="text-center mb-16">
            <p class="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">FAQs</p>
            <h1 class="text-4xl font-bold text-gray-900">Frequently Asked <span class="text-gray-400 italic font-light">Questions</span></h1>
        </div>
        <div class="space-y-6">
            <?php foreach ($faqs as $faq) : ?>
                <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h4 class="text-lg font-bold text-gray-900 mb-4"><?php echo esc_html($faq['question']); ?></h4>
                    <p class="text-gray-500 text-sm leading-relaxed"><?php echo esc_html($faq['answer']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php
get_footer();
