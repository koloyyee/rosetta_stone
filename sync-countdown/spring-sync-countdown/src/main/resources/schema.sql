-- DROP TABLE IF EXISTS rooms;
-- DROP TABLE IF EXISTS room_users;
CREATE TABLE IF NOT EXISTS rooms (
	-- id BIGINT AUTO_INCREMENT PRIMARY KEY,
	id UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	duration BIGINT DEFAULT 0,
	status VARCHAR(20) DEFAULT 'NOT_STARTED' NOT NULL CHECK (
		status in ('NOT_STARTED', 'RUNNING', 'PAUSED', 'FINISHED')
	)
);

INSERT INTO
	rooms (name)
SELECT
	'original'
WHERE
	NOT EXISTS (
		SELECT
			1
		FROM
			rooms
		WHERE
			name = 'original'
	);

CREATE TABLE IF NOT EXISTS room_users (
	room_id UUID NOT NULL,
	username VARCHAR(50) NOT NULL,
	PRIMARY KEY (room_id, username),
	FOREIGN KEY (room_id) REFERENCES rooms(id),
	FOREIGN KEY (username) REFERENCES users(username)
);