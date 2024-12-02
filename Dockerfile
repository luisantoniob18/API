FROM php:8.2-apache

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copia todos los archivos del proyecto a este directorio en el contenedor
COPY . .

# Configura permisos para el usuario de Apache (www-data)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Instala extensiones necesarias para Laravel
RUN docker-php-ext-install pdo pdo_mysql

# Habilita módulos necesarios en Apache
RUN a2enmod ssl rewrite

# Copia el certificado y la clave privada al contenedor
COPY certificate.crt /etc/ssl/certs/laravel.crt
COPY private.key /etc/ssl/private/laravel.key

# Configura un archivo virtual host para HTTPS
RUN echo "<VirtualHost *:443>\n\
    DocumentRoot /var/www/html/public\n\
    SSLEngine on\n\
    SSLCertificateFile /etc/ssl/certs/laravel.crt\n\
    SSLCertificateKeyFile /etc/ssl/private/laravel.key\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>" > /etc/apache2/sites-available/laravel-ssl.conf

# Configura un archivo virtual host para HTTP
RUN echo "<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>" > /etc/apache2/sites-available/laravel-http.conf

# Deshabilita el sitio por defecto y habilita los sitios personalizados
RUN a2dissite 000-default.conf
RUN a2ensite laravel-http.conf
RUN a2ensite laravel-ssl.conf

# Reinicia Apache para asegurarse de que las configuraciones se apliquen correctamente
CMD ["apache2-foreground"]


