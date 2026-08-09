<?php
/**
 * Plugin Name: HUN Revalidate
 * Description: Fires a webhook to the Next.js frontend to trigger ISR revalidation when posts or properties are published or updated.
 * Version: 1.0.0
 * Author: House Unlimited Nigeria
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'HUN_FRONTEND_URL', get_option( 'hun_frontend_url', 'https://houseunlimitednigeria.com' ) );
define( 'HUN_WEBHOOK_SECRET', get_option( 'hun_webhook_secret', '' ) );

/**
 * Fire revalidation webhook on post publish/update.
 */
function hun_revalidate_on_save( $post_id, $post, $update ) {
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( wp_is_post_revision( $post_id ) ) return;
    if ( $post->post_status !== 'publish' ) return;

    $type_map = [
        'post'     => 'post',
        'property' => 'property',
        'page'     => 'page',
    ];

    $type = $type_map[ $post->post_type ] ?? null;
    if ( ! $type ) return;

    $payload = wp_json_encode( [
        'type' => $type,
        'slug' => $post->post_name,
        'id'   => $post_id,
    ] );

    $args = [
        'method'  => 'POST',
        'timeout' => 10,
        'headers' => [
            'Content-Type'     => 'application/json',
            'x-webhook-secret' => HUN_WEBHOOK_SECRET,
        ],
        'body'    => $payload,
    ];

    $url = trailingslashit( HUN_FRONTEND_URL ) . 'api/revalidate';
    $response = wp_remote_post( $url, $args );

    if ( is_wp_error( $response ) ) {
        error_log( 'HUN Revalidate: ' . $response->get_error_message() );
    }
}
add_action( 'save_post', 'hun_revalidate_on_save', 10, 3 );

/**
 * Settings page under Settings > HUN Revalidate.
 */
function hun_revalidate_settings_page() {
    if ( isset( $_POST['hun_save'] ) ) {
        check_admin_referer( 'hun_revalidate_settings' );
        update_option( 'hun_frontend_url', sanitize_url( $_POST['hun_frontend_url'] ) );
        update_option( 'hun_webhook_secret', sanitize_text_field( $_POST['hun_webhook_secret'] ) );
        echo '<div class="updated"><p>Settings saved.</p></div>';
    }
    $url    = get_option( 'hun_frontend_url', 'https://houseunlimitednigeria.com' );
    $secret = get_option( 'hun_webhook_secret', '' );
    ?>
    <div class="wrap">
        <h1>HUN Revalidate Settings</h1>
        <form method="post">
            <?php wp_nonce_field( 'hun_revalidate_settings' ); ?>
            <table class="form-table">
                <tr>
                    <th>Frontend URL</th>
                    <td><input type="url" name="hun_frontend_url" value="<?php echo esc_attr( $url ); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th>Webhook Secret</th>
                    <td><input type="text" name="hun_webhook_secret" value="<?php echo esc_attr( $secret ); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <p class="submit"><input type="submit" name="hun_save" class="button-primary" value="Save Settings" /></p>
        </form>
    </div>
    <?php
}

function hun_revalidate_menu() {
    add_options_page( 'HUN Revalidate', 'HUN Revalidate', 'manage_options', 'hun-revalidate', 'hun_revalidate_settings_page' );
}
add_action( 'admin_menu', 'hun_revalidate_menu' );
