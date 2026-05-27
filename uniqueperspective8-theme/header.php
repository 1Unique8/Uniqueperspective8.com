<?php
/**
 * The header for our theme
 *
 * @package uniqueperspective8
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header>
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; justify-content: space-between;">
        <div class="logo">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #fff; text-decoration: none;">
                    ✨ UNIQUE PERSPECTIVE 8
                </a>
            <?php endif; ?>
        </div>

        <nav>
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'primary-menu',
                'fallback_cb'    => false,
            ) );
            ?>
            <a href="<?php echo esc_url( home_url( '/shop' ) ); ?>" class="btn" style="padding: 8px 20px; font-size: 0.9rem;">Shop Now</a>
        </nav>
    </div>
</header>
