<header class="header">
    <div class="header-logo">
        <a href="{{ route('Startseite') }}">
            <img src="{{ asset('images/logo.svg') }}" alt="Logo">
        </a>
    </div>
    <div class="header-search">
    <form action="{{ route('Startseite') }}" method="GET" id="search">
            <img src="{{ asset('images/lupe.svg') }}" alt="Suchlupe">
            <input type="text" name="search" placeholder="Was suchst du?" value="{{ request('search') }}">
            <div id="search_line"></div>
            <img src="{{ asset('images/location.svg') }}" alt="Ort">
            <input name="search_location" type="text" placeholder=" Ort"  value="{{ request('search_location') }}">
            <button type="submit">Suchen</button>
        </form>
    </div>
    <div class="header-icons">
        <a href=""><img src="{{ asset('images/profile.svg') }}" alt="Profil"></a>
        <a href="{{ route('listings.create') }}"><img src="{{ asset('images/create_listing.svg') }}" alt="Listing erstellen"></a>
        <a href="#"><img src="{{ asset('images/heart.svg') }}" alt="Favoriten"></a>
    </div>
</header>