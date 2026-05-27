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
            <div style="max-width: 800px; padding: 0 1rem;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">Dug by Hand. Crafted by Heart.</h1>
                <p style="font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9;">Ethical Minerals • Handcrafted Jewelry • Conscious Living from British Columbia</p>
                <a href="<?php echo esc_url( home_url( '/shop' ) ); ?>" class="btn">Explore the Collection</a>
                <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="btn" style="background: transparent; border: 2px solid var(--gold); color: var(--gold); margin-left: 1rem;">Our Story</a>
            </div>
        </section>

        <!-- Featured / Intro -->
        <section style="padding: 4rem 1rem; max-width: 1100px; margin: 0 auto; text-align: center;">
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Raw Origins. Refined Craft.</h2>
            <p style="max-width: 700px; margin: 0 auto 2rem; font-size: 1.1rem;">
                Every piece tells a story of the land. Sourced ethically from British Columbia's mineral-rich landscapes, 
                hand-selected and crafted with intention into timeless jewelry and keepsakes.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem;">
                <div>
                    <h3>Ethically Sourced</h3>
                    <p>Free Miner's Certificate • Responsible collection from abandoned mines and placer claims.</p>
                </div>
                <div>
                    <h3>Handcrafted with Love</h3>
                    <p>Wire-wrapped pendants, one-of-a-kind pieces featuring quartz, jasper, pyrite, petrified wood & more.</p>
                </div>
                <div>
                    <h3>Conscious Living</h3>
                    <p>Supporting local artisans and giving back through our hybrid social enterprise in Oliver, BC.</p>
                </div>
            </div>
        </section>

    <?php else : ?>
        <!-- Default content for other pages -->
        <div style="padding: 4rem 1rem; max-width: 900px; margin: 0 auto;">
            <?php
            if ( have_posts() ) :
                while ( have_posts() ) : the_post();
                    the_content();
                endwhile;
            else :
                echo '<p>No content found.</p>';
            endif;
            ?>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
