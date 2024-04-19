FROM nginx

# 隐藏nginx的版本
ADD docker/nginx.conf /etc/nginx/

COPY docker/default.conf /etc/nginx/conf.d/

COPY --chown=nginx:nginx dist /usr/share/nginx/html/