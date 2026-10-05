FROM php:8.2-apache-bookworm

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libzip-dev libicu-dev \
    libpq-dev \
    zip unzip git curl gnupg2 apt-transport-https

# Agregar repositorio de Microsoft para SQL Server ODBC Driver
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -sSL https://packages.microsoft.com/config/debian/12/prod.list > /etc/apt/sources.list.d/mssql-release.list

# Instalar msodbcsql18 y dependencias
RUN apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Extensiones de PHP (Fundamentales para Backend moderno + SQL Server)
RUN docker-php-ext-install mbstring exif pcntl bcmath gd intl zip pdo_pgsql pgsql \
    && pecl install sqlsrv-5.12.0 pdo_sqlsrv-5.12.0 \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv

# Habilitar Rewrite para .htaccess (Laravel/CI4 lo requieren)
RUN a2enmod rewrite

# Composer global
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html