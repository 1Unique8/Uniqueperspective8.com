<?php
/**
 * Template Name: Education Hub
 * Template Post Type: page
 *
 * Field-to-shelf education hub for slug /education.
 * Assign this template to a page whose permalink slug is education.
 *
 * @package uniqueperspective8
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
get_header();

$shop    = function_exists( 'uniqueperspective8_shop_url' ) ? uniqueperspective8_shop_url() : home_url( '/shop/' );
$contact = home_url( '/contact/' );
$stages  = array(
    array(
        'id'      => 'field',
        'n'       => '01',
        'kicker'  => 'Field',
        'title'   => 'Whose ground is this?',
        'lead'    => 'Before a pocket fills, the question is tenure, territory, and what the river already moved.',
        'guides'  => array(
            array(
                'n'     => '01',
                'title' => 'The BC Free Miner & Ethical Field Collecting Code',
                'text'  => 'Recreational rockhounding versus a Free Miner Certificate, Mineral Titles Online, Syilx territory, and leave-no-trace field work.',
                'href'  => home_url( '/education/free-miner/' ),
            ),
            array(
                'n'     => '06',
                'title' => 'Float to vein',
                'text'  => 'South Okanagan and Similkameen method: float trains, bedrock traps, gossan, and the log.',
                'href'  => home_url( '/education/south-okanagan-similkameen-prospecting/' ),
            ),
        ),
    ),
    array(
        'id'      => 'read',
        'n'       => '02',
        'kicker'  => 'Read',
        'title'   => 'What does the stone answer under a test?',
        'lead'    => 'Color is a rumor. Hardness, streak, light, and the company a stone keeps are the reading.',
        'guides'  => array(
            array(
                'n'     => '02',
                'title' => 'Field Mineral Identification & Physical Testing',
                'text'  => 'Hardness, streak, translucency, UV, and acid — repeatable tests instead of guessing from color.',
                'href'  => home_url( '/education/identification/' ),
            ),
            array(
                'n'     => '03',
                'title' => 'Regional Mineral Profiles',
                'text'  => 'South Okanagan and Similkameen jaspers, chalcedony, chert, agate, skarn, argillite, and schist.',
                'href'  => home_url( '/education/regional-minerals/' ),
            ),
            array(
                'n'     => '04',
                'title' => 'Gossan & Vein Guide',
                'text'  => 'Boxwork, oxidation halos, vugs, selvages, accessory minerals — and gold versus pyrite.',
                'href'  => home_url( '/education/gossan-vein/' ),
            ),
        ),
    ),
    array(
        'id'      => 'bench',
        'n'       => '03',
        'kicker'  => 'Bench',
        'title'   => 'What may the hand change?',
        'lead'    => 'The bench holds the stone. It does not hide the face. A certificate is not a license to erase origin.',
        'guides'  => array(
            array(
                'n'     => '05',
                'title' => 'Field-to-finished journey',
                'text'  => 'Specimen numbers, provenance cards, BC FMC verification, and low-impact studio craft.',
                'href'  => home_url( '/education/provenance/' ),
            ),
        ),
    ),
);
?>
<style>
  .education-hub .shelf-path{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);margin:36px 0 0;padding:0;border-top:1px solid rgba(200,204,208,.24);border-bottom:1px solid rgba(200,204,208,.24)}
  .education-hub .shelf-path a{display:flex;flex-direction:column;gap:8px;min-height:88px;padding:16px;border-right:1px solid rgba(200,204,208,.24);font-family:Georgia,serif;font-size:22px}
  .education-hub .shelf-path li:last-child a{border-right:0}
  .education-hub .shelf-path span{font-family:inherit;font-size:11px;letter-spacing:2px;text-transform:uppercase}
  .education-hub .station-lead{max-width:640px}
  @media (max-width:820px){.education-hub .shelf-path{grid-template-columns:1fr 1fr}}
</style>
<main id="education-hub" class="education-hub">
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow"><?php esc_html_e( 'Education · Field to shelf', 'uniqueperspective8' ); ?></p>
      <h1><?php esc_html_e( 'From the cut', 'uniqueperspective8' ); ?><br><em><?php esc_html_e( 'to the shelf.', 'uniqueperspective8' ); ?></em></h1>
      <p class="lead"><?php esc_html_e( 'A stone does not earn a place in the drawer by being pretty. It earns it by keeping its ground, its test, and its number.', 'uniqueperspective8' ); ?></p>
      <ol class="shelf-path">
        <li><a href="#field"><span>01</span><?php esc_html_e( 'Field', 'uniqueperspective8' ); ?></a></li>
        <li><a href="#read"><span>02</span><?php esc_html_e( 'Read', 'uniqueperspective8' ); ?></a></li>
        <li><a href="#bench"><span>03</span><?php esc_html_e( 'Bench', 'uniqueperspective8' ); ?></a></li>
        <li><a href="#shelf"><span>04</span><?php esc_html_e( 'Shelf', 'uniqueperspective8' ); ?></a></li>
      </ol>
    </div>
  </section>

  <?php foreach ( $stages as $stage ) : ?>
    <section class="section" id="<?php echo esc_attr( $stage['id'] ); ?>">
      <div class="wrap">
        <p class="eyebrow"><?php echo esc_html( $stage['n'] . ' · ' . $stage['kicker'] ); ?></p>
        <h2><?php echo esc_html( $stage['title'] ); ?></h2>
        <p class="station-lead"><?php echo esc_html( $stage['lead'] ); ?></p>
        <div class="pillar-grid">
          <?php foreach ( $stage['guides'] as $guide ) : ?>
            <article class="pillar">
              <span class="pillar-number"><?php echo esc_html( $guide['n'] ); ?></span>
              <span>
                <h3><a href="<?php echo esc_url( $guide['href'] ); ?>"><?php echo esc_html( $guide['title'] ); ?></a></h3>
                <p><?php echo esc_html( $guide['text'] ); ?></p>
                <a class="text-link" href="<?php echo esc_url( $guide['href'] ); ?>"><?php esc_html_e( 'Open guide', 'uniqueperspective8' ); ?> ↗</a>
              </span>
            </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
  <?php endforeach; ?>

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
      <p class="eyebrow"><?php esc_html_e( 'From the journal', 'uniqueperspective8' ); ?></p>
      <h2><?php esc_html_e( 'Notes that still belong on the path.', 'uniqueperspective8' ); ?></h2>
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

  <section class="section cream" id="shelf">
    <div class="wrap article">
      <p class="eyebrow"><?php esc_html_e( '04 · Shelf', 'uniqueperspective8' ); ?></p>
      <h2><?php esc_html_e( 'What still travels with it?', 'uniqueperspective8' ); ?></h2>
      <p><?php esc_html_e( 'The shelf is the last station: a named stone, a card, and a reason the piece was allowed to leave the drawer. If the field is missing, the shelf is only a product.', 'uniqueperspective8' ); ?></p>
      <div class="cta-row">
        <a class="cta-card" href="<?php echo esc_url( home_url( '/education/provenance/' ) ); ?>">
          <h3><?php esc_html_e( 'The card', 'uniqueperspective8' ); ?></h3>
          <p><?php esc_html_e( 'Specimen number and provenance, still attached.', 'uniqueperspective8' ); ?></p>
          <span class="text-link"><?php esc_html_e( 'Provenance', 'uniqueperspective8' ); ?> ↗</span>
        </a>
        <a class="cta-card" href="<?php echo esc_url( $shop ); ?>">
          <h3><?php esc_html_e( 'The live shelf', 'uniqueperspective8' ); ?></h3>
          <p><?php esc_html_e( 'Named stones whose sale supports field work and studio craft.', 'uniqueperspective8' ); ?></p>
          <span class="text-link"><?php esc_html_e( 'Shop', 'uniqueperspective8' ); ?> ↗</span>
        </a>
        <a class="cta-card" href="<?php echo esc_url( $contact ); ?>">
          <h3><?php esc_html_e( 'Ask the bench', 'uniqueperspective8' ); ?></h3>
          <p><?php esc_html_e( 'Recycled 925 dead-soft sterling. No resins, no coatings that hide the stone.', 'uniqueperspective8' ); ?></p>
          <span class="text-link"><?php esc_html_e( 'Contact', 'uniqueperspective8' ); ?> ↗</span>
        </a>
      </div>
    </div>
  </section>
</main>
<?php
get_footer();
