/* je crée une base de données nommée 'recipes_app'
puis j'indique à mon logiciel que toutes les instructions suivantes
concernent la base de données recipes_app */
CREATE DATABASE IF NOT EXISTS recipes_app;
USE recipes_app;

create table if not exists tags
(
    id            int          not null primary key auto_increment,
    tag_name      varchar(50)  not null unique,
    description   varchar(255) null,
    parent_tag_id int          null,
    constraint tag_parents_tag___fk foreign key (`parent_tag_id`) references tags (`id`) ON DELETE CASCADE
);
create table if not exists images
(
    id         int          not null primary key auto_increment,
    url        varchar(255) not null,
    image_path varchar(255) not null,
    created_at datetime     not null default current_timestamp,
    updated_at datetime     null     default current_timestamp
);
create table if not exists users
(
    id         int          not null primary key auto_increment,
    username   varchar(50)  not null unique,
    email      varchar(50)  not null unique,
    password   varchar(255) not null,
    first_name varchar(50)  null,
    last_name  varchar(50)  null,
    created_at datetime     not null default current_timestamp,
    updated_at datetime     null     default current_timestamp,
    id_image   int          null,
    constraint users___fk foreign key (`id_image`) references images (`id`) ON DELETE CASCADE
);
create table if not exists ingredients
(
    id              int          not null primary key auto_increment,
    ingredient_name varchar(50)  not null unique,
    description     varchar(255) null,
    id_image        int          null,
    constraint ingredients___fk foreign key (id_image) references images (id) ON DELETE CASCADE
);
create table if not exists difficulty
(
    id              int         not null primary key auto_increment,
    difficulty_name varchar(50) not null
);
create table if not exists recipes
(
    id               int          not null primary key auto_increment,
    recipe_name      varchar(255) not null,
    description      text         not null,
    cooking_time     int          not null,
    break_time       int          not null,
    preparation_time int          not null,
    recipe_portion   int          not null,
    unit_portion     varchar(50)  not null,
    created_at       datetime     not null default current_timestamp,
    update_at        datetime     null     default current_timestamp,
    advice           text         null,
    id_tag           int          null,
    id_user          int          null,
    id_image         int          null,
    id_difficulty    int          null,
    constraint recipes___fk_tag foreign key (id_tag) references tags (id) ON DELETE CASCADE,
    constraint recipes___fk_user foreign key (id_user) references users (id) ON DELETE CASCADE,
    constraint recipes___fk_image foreign key (id_image) references images (id) ON DELETE CASCADE,
    constraint recipes___fk_difficulty foreign key (id_difficulty) references difficulty (id) ON DELETE CASCADE
);
create table if not exists recipeHasIngredient
(
    id            int         not null primary key auto_increment,
    quantity      float       not null,
    unit          varchar(50) not null,
    id_ingredient int         null,
    id_recipe     int         null,
    created_at datetime     not null default current_timestamp,
    updated_at datetime     null     default current_timestamp,
    constraint recipeHasIngredient___fk_ingredient foreign key (id_ingredient) references ingredients (id) ON DELETE CASCADE,
    constraint recipeHasIngredient___fk_recipe foreign key (id_recipe) references recipes (id) ON DELETE CASCADE
);
create table if not exists steps
(
    id          int  not null primary key auto_increment,
    description text not null,
    id_recipe   int  null,
    constraint steps___fk_recipe foreign key (id_recipe) references recipes (id) ON DELETE CASCADE
);

CREATE TABLE if not exists personal_access_tokens
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255)       NOT NULL,
    tokenable_id   INT                NOT NULL,
    name           VARCHAR(255)       NOT NULL,
    token          VARCHAR(64) UNIQUE NOT NULL,
    abilities      TEXT               NOT NULL,
    last_used_at   TIMESTAMP          NULL DEFAULT NULL,
    created_at     TIMESTAMP          NULL DEFAULT NULL,
    updated_at     TIMESTAMP          NULL DEFAULT NULL,
    expires_at     TIMESTAMP          NULL DEFAULT NULL
);
