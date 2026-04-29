<?php
/**
 * Fallback template for editors who remain on the WordPress domain.
 *
 * @package house-unlimited-headless
 */

get_header();
?>
<main style="max-width: 760px; margin: 4rem auto; padding: 0 1rem;">
	<h1><?php esc_html_e( 'Headless WordPress Theme Active', 'house-unlimited-headless' ); ?></h1>
	<p>
		<?php esc_html_e( 'Content is authored in WordPress and rendered by the Next.js frontend.', 'house-unlimited-headless' ); ?>
	</p>
	<p>
		<a href="<?php echo esc_url( hun_headless_frontend_url() ); ?>">
			<?php esc_html_e( 'Open the public frontend', 'house-unlimited-headless' ); ?>
		</a>
	</p>
</main>
<?php
get_footer();
