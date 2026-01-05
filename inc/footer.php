<!-- External JS -->
<script src="assets/js/theme.js"></script>
<?php if (basename($_SERVER['PHP_SELF']) == 'index.php'): ?>
    <script src="assets/js/calculator.js?v=1.1"></script>
<?php elseif (basename($_SERVER['PHP_SELF']) == 'calculations.php'): ?>
    <script src="assets/js/reports.js?v=1.1"></script>
<?php endif; ?>
</body>

</html>