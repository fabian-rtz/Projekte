import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/header.css', 'resources/css/footer.css','resources/css/listing-card.css','resources/css/flash-message.css','resources/css/listing-detail.css','resources/css/app.css','resources/css/register.css','resources/css/login.css','resources/css/profile-index.css','resources/css/create.css','resources/css/edit.css','resources/css/filter-sidebar.css','resources/css/index.css'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
