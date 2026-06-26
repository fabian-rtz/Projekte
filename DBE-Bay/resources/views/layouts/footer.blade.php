<footer class="footer">
    <div class="footer-container">
        <div class="footer-logo">
            <a href="{{ route('Startseite') }}">
                <img src="{{ asset('images/logo.svg') }}" alt="Logo">
            </a>

        </div>
        <div class="footer-column">
            <h4>Unternehmen</h4>
            <ul>
                <li><a href="#">Über uns</a></li>
                <li><a href="#">Karriere</a></li>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">Hilfebereich</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Rechtliches</h4>
            <ul>
                <li><a href="#">Impressum</a></li>
                <li><a href="#">Datenschutz</a></li>
                <li><a href="#">AGB</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Social Media</h4>
            <div class="footer-social">
                <a href="#"><img src="{{ asset('images/instagram.svg') }}" alt="Instagram"></a>
                <a href="#"><img src="{{ asset('images/facebook.svg') }}" alt="Facebook"></a>
                <a href="#"><img src="{{ asset('images/youtube.svg') }}" alt="YouTube"></a>
                <a href="#"><img src="{{ asset('images/tiktok.svg') }}" alt="TikTok"></a>
            </div>
            <p class="footer-copyright">Alle Rechte vorbehalten.</p>
        </div>
    </div>
</footer>