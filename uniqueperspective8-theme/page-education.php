<?php
/**
 * Template Name: Education Hub
 * Template Post Type: page
 *
 * WordPress section / category hub for slug /education (or /knowledge).
 * Assign this template to a page whose permalink slug is education.
 *
 * @package uniqueperspective8
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
get_header();

$shop     = function_exists( 'uniqueperspective8_shop_url' ) ? uniqueperspective8_shop_url() : home_url( '/shop/' );
$contact  = home_url( '/contact/' );
$guides   = array(
    array(
        'n' => '01',
        'title' => 'The BC Free Miner & Ethical Field Collecting Code',
        'text'  => 'Recreational rockhounding versus a Free Miner Certificate, Mineral Titles Online, Syilx territory, and leave-no-trace field work.',
        'href'  => home_url( '/education/free-miner/' ),
        'shop'  => $shop,
    ),
    array(
        'n' => '02',
        'title' => 'Field Mineral Identification & Physical Testing',
        'text'  => 'Hardness, streak, translucency, UV, and acid — repeatable tests instead of guessing from color.',
        'href'  => home_url( '/education/identification/' ),
        'shop'  => $shop,
    ),
    array(
        'n' => '03',
        'title' => 'Regional Mineral Profiles',
        'text'  => 'South Okanagan and Similkameen jaspers, chalcedony, chert, agate, skarn, argillite, and schist.',
        'href'  => home_url( '/education/regional-minerals/' ),
        'shop'  => home_url( '/product-category/jasper/' ),
    ),
    array(
        'n' => '04',
        'title' => 'Gossan & Vein Guide',
        'text'  => 'Boxwork, oxidation halos, vugs, selvages, accessory minerals — and gold versus pyrite.',
        'href'  => home_url( '/education/gossan-vein/' ),
        'shop'  => $shop,
    ),
    array(
        'n' => '05',
        'title' => 'Field-to-Finished Journey',
        'text'  => 'Specimen numbers, provenance cards, BC FMC verification, and low-impact studio craft.',
        'href'  => home_url( '/education/provenance/' ),
        'shop'  => $shop,
    ),
);
?>
<main id="education-hub" class="education-hub">
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Field &amp; mineral education</p>
      <h1><?php esc_html_e( 'Dug by hand.', 'uniqueperspective8' ); ?><br><em><?php esc_html_e( 'Crafted by heart.', 'uniqueperspective8' ); ?></em></h1>
      <p class="lead"><?php esc_html_e( 'Grounded geological knowledge, ethical prospecting, and transparent provenance from the South Okanagan and Similkameen river systems.', 'uniqueperspective8' ); ?></p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <p class="eyebrow"><?php esc_html_e( 'Pillar content', 'uniqueperspective8' ); ?></p>
      <h2><?php esc_html_e( 'Read the land before you take from it.', 'uniqueperspective8' ); ?></h2>
      <div class="pillar-grid">
        <?php foreach ( $guides as $guide ) : ?>
          <article class="pillar">
            <span class="pillar-number"><?php echo esc_html( $guide['n'] ); ?></span>
            <span>
              <h3><a href="<?php echo esc_url( $guide['href'] ); ?>"><?php echo esc_html( $guide['title'] ); ?></a></h3>
              <p><?php echo esc_html( $guide['text'] ); ?></p>
              <a class="text-link" href="<?php echo esc_url( $guide['href'] ); ?>"><?php esc_html_e( 'Open guide', 'uniqueperspective8' ); ?> ↗</a>
              <a class="text-link" href="<?php echo esc_url( $guide['shop'] ); ?>"><?php esc_html_e( 'Shop related specimens', 'uniqueperspective8' ); ?></a>
            </span>
          </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <?php
  $education_query = new WP_Query(
      array(
          'post_type'      => 'post',
          'posts_per_page' => 6,
          'category_name'  => 'education',
      )
  );
  if ( $education_query->have_posts() ) :
  ?>
  <section class="section cream">
    <div class="wrap">
      <p class="eyebrow"><?php esc_html_e( 'Category', 'uniqueperspective8' ); ?></p>
      <h2><?php esc_html_e( 'From the education category', 'uniqueperspective8' ); ?></h2>
      <div class="pillar-grid">
        <?php
        while ( $education_query->have_posts() ) :
            $education_query->the_post();
            ?>
            <a class="pillar" href="<?php the_permalink(); ?>">
              <span class="pillar-number"><?php echo esc_html( get_the_date( 'y' ) ); ?></span>
              <span>
                <h3><?php the_title(); ?></h3>
                <p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 22 ) ); ?></p>
                <span class="text-link"><?php esc_html_e( 'Read', 'uniqueperspective8' ); ?> ↗</span>
              </span>
            </a>
            <?php
        endwhile;
        wp_reset_postdata();
        ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <section class="section cream">
    <div class="wrap article">
      <p class="eyebrow"><?php esc_html_e( 'Next step', 'uniqueperspective8' ); ?></p>
      <h2><?php esc_html_e( 'Grounded knowledge, lawful ground.', 'uniqueperspective8' ); ?></h2>
      <div class="cta-row">
        <a class="cta-card" href="<?php echo esc_url( $shop ); ?>">
          <h3><?php esc_html_e( 'Browse hand-dug specimens', 'uniqueperspective8' ); ?></h3>
          <p><?php esc_html_e( 'Named stones whose sale supports field work and studio craft.', 'uniqueperspective8' ); ?></p>
          <span class="text-link"><?php esc_html_e( 'Shop', 'uniqueperspective8' ); ?> ↗</span>
        </a>
        <a class="cta-card" href="<?php echo esc_url( $contact ); ?>">
          <h3><?php esc_html_e( 'Request a custom wire-wrap', 'uniqueperspective8' ); ?></h3>
          <p><?php esc_html_e( 'Recycled 925 dead-soft sterling. No resins, no coatings that hide the stone.', 'uniqueperspective8' ); ?></p>
          <span class="text-link"><?php esc_html_e( 'Contact', 'uniqueperspective8' ); ?> ↗</span>
        </a>
        <a class="cta-card" href="<?php echo esc_url( home_url( '/map/' ) ); ?>">
          <h3><?php esc_html_e( 'Explore the UP8 community map', 'uniqueperspective8' ); ?></h3>
          <p><?php esc_html_e( 'River systems and formations, not pin-drops on a claim.', 'uniqueperspective8' ); ?></p>
          <span class="text-link"><?php esc_html_e( 'Map', 'uniqueperspective8' ); ?> ↗</span>
        </a>
      </div>
    </div>
  </section>
</main>
<?php
get_footer();
