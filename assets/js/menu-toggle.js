document.addEventListener('DOMContentLoaded', () => {

    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileToggle || !navMenu) return;

    // Open / close mobile menu
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });


    // Mobile submenu handling
    const parentItems = navMenu.querySelectorAll('.nav-links > li');

    parentItems.forEach(item => {

        const submenu = item.querySelector(':scope > ul');
        const parentLink = item.querySelector(':scope > a');

        if (!submenu || !parentLink) return;

        parentLink.addEventListener('click', (e) => {

            // Only apply this behaviour on mobile
            if (window.innerWidth <= 768) {

                e.preventDefault();
                e.stopPropagation();

                // Close other open submenus
                parentItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('submenu-open');
                    }
                });

                // Toggle current submenu
                item.classList.toggle('submenu-open');
            }
        });
    });


    // Close menu when clicking submenu links
    const submenuLinks = navMenu.querySelectorAll('.nav-links ul a');

    submenuLinks.forEach(link => {

        link.addEventListener('click', () => {

            if (window.innerWidth <= 768) {

                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');

                parentItems.forEach(item => {
                    item.classList.remove('submenu-open');
                });
            }

        });

    });


    // Close menu when clicking outside
    document.addEventListener('click', (e) => {

        if (
            window.innerWidth <= 768 &&
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileToggle.contains(e.target)
        ) {

            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');

            parentItems.forEach(item => {
                item.classList.remove('submenu-open');
            });
        }

    });


    // Reset mobile classes when switching to desktop
    window.addEventListener('resize', () => {

        if (window.innerWidth > 768) {

            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');

            parentItems.forEach(item => {
                item.classList.remove('submenu-open');
            });

        }

    });

});