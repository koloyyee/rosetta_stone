-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;


create table IF NOT EXISTS users(
	username varchar(100) not null primary key,
	password varchar(500) not null,
	enabled boolean not null
);

create table IF NOT EXISTS authorities (
	username varchar(100) not null,
	authority varchar(50) not null,
	constraint fk_authorities_users foreign key(username) references users(username)
);

create unique index IF NOT EXISTS ix_auth_username on authorities (username, authority);

CREATE TABLE IF NOT EXISTS rooms (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	is_timer_running BOOLEAN DEFAULT FALSE
);

-- Insert with conflict handling
INSERT INTO
	rooms (name)
VALUES
	('original') ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS room_users (
	room_id UUID NOT NULL,
	username VARCHAR(50) NOT NULL,
	PRIMARY KEY (room_id, username),
	FOREIGN KEY (room_id) REFERENCES rooms(id),
	FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS booking_records (
	id BIGSERIAL PRIMARY KEY,
	room_id UUID NOT NULL,
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	FOREIGN KEY (room_id) REFERENCES rooms(id)
);