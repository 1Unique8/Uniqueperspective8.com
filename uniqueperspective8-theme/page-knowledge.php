<?php
/**
 * Template Name: Knowledge Hub (alias of Education)
 * Template Post Type: page
 *
 * Use this only if you want a published page at /knowledge that points
 * readers to the canonical /education hub.
 *
 * @package uniqueperspective8
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
wp_safe_redirect( home_url( '/education/' ), 301 );
exit;
