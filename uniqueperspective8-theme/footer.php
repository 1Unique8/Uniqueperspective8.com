<?php
/**
 * The footer for our theme
 *
 * @package uniqueperspective8
 */
?>

<footer>
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <p>&copy; <?php echo date('Y'); ?> Unique Perspective 8 — Ethical Minerals & Handcrafted Jewelry from British Columbia</p>
        <p style="margin-top: 1rem; font-size: 0.9rem;">
            <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" style="color: #888; margin: 0 10px;">About</a> |
            <a href="<?php echo esc_url( home_url( '/contact' ) ); ?>" style="color: #888; margin: 0 10px;">Contact</a> |
            <a href="<?php echo esc_url( home_url( '/policies' ) ); ?>" style="color: #888; margin: 0 10px;">Policies</a>
        </p>
        <p style="margin-top: 1.5rem; font-size: 0.8rem; color: #666;">
            Dug by Hand. Crafted by Heart. | Fall 7, Stand 8
        </p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
