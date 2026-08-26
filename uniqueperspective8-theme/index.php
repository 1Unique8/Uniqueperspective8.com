<?php
/**
 * The main template file
 *
 * @package uniqueperspective8
 */

get_header();
?>

<main>
    <?php if ( is_front_page() || is_home() ) : ?>
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-inner">
                <div class="hero-copy">
                    <p class="hero-eyebrow">Field collected</p>
                    <h1>Similkameen stone,<br>raised to <span class="accent">heirloom.</span></h1>
                    <p class="hero-lead">
                        Polychrome jasper from the Similkameen River near Princeton, wrapped by hand in sterling silver.
                        One-of-a-kind work whose sale supports artisans and community resilience in the South Okanagan.
                    </p>
                    <div class="hero-actions">
                        <a href="<?php echo esc_url( home_url( '/shop' ) ); ?>" class="btn">Field Collection</a>
                        <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="btn btn-ghost">Provenance</a>
                    </div>
                </div>

                <figure class="hero-media">
                    <a href="<?php echo esc_url( home_url( '/product/polychrome-jasper-pendant/' ) ); ?>">
                        <img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/polychrome-jasper-pendant-hero.jpg' ); ?>"
                             alt="Polychrome jasper pendant, Similkameen River near Princeton">
                    </a>
                    <figcaption>Polychrome jasper · Similkameen River</figcaption>
                </figure>
            </div>
        </section
