<?php
/** DESIGN REMINDER: Collector's Folio — provenance-led, warm editorial luxury; retain native WordPress and WooCommerce capabilities. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uniqueperspective8_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array( 'height' => 90, 'width' => 90, 'flex-height' => true, 'flex-width' => true ) );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
    register_nav_menus( array( 'primary' => __( 'Primary Menu', 'uniqueperspective8' ), 'footer' => __( 'Footer Menu', 'uniqueperspective8' ) ) );
}
add_action( 'after_setup_theme', 'uniqueperspective8_setup' );

function uniqueperspective8_assets() {
    wp_enqueue_style( 'uniqueperspective8-fonts', 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap', array(), null );
    wp_enqueue_style( 'uniqueperspective8-style', get_stylesheet_uri(), array(), '2.0.0' );
    wp_enqueue_style( 'uniqueperspective8-folio', get_stylesheet_directory_uri() . '/assets/folio.css', array( 'uniqueperspective8-style' ), '2.0.0' );
    wp_enqueue_script( 'uniqueperspective8-theme', get_stylesheet_directory_uri() . '/assets/theme.js', array(), '2.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'uniqueperspective8_assets' );

function uniqueperspective8_shop_url() {
    return function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
}

function uniqueperspective8_fallback_menu() {
    echo '<ul id="primary-menu" class="folio-menu"><li><a href="#atelier">The atelier</a></li><li><a href="#collection">The collection</a></li><li><a href="#origin">Origin</a></li><li><a href="#journal">Journal</a></li></ul>';
}
