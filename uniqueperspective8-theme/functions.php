<?php
/**
 * Unique Perspective 8 Theme Functions
 *
 * @package uniqueperspective8
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Theme setup
function uniqueperspective8_setup() {
    // Add theme support
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
    add_theme_support( 'woocommerce' ); // WooCommerce support
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    // Register navigation menus
    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'uniqueperspective8' ),
        'footer'  => __( 'Footer Menu', 'uniqueperspective8' ),
    ) );
}
add_action( 'after_setup_theme', 'uniqueperspective8_setup' );

// Enqueue styles and scripts
function uniqueperspective8_scripts() {
    wp_enqueue_style( 'uniqueperspective8-style', get_stylesheet_uri(), array(), '1.0.0' );
    
    // Google Fonts
    wp_enqueue_style( 'uniqueperspective8-fonts', 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;600&display=swap', array(), null );
}
add_action( 'wp_enqueue_scripts', 'uniqueperspective8_scripts' );

// WooCommerce: Remove default styles if desired (optional)
// add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

// Customizer or additional features can be added here
