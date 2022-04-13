CREATE TABLE Singers (
    SingerId     String(MAX) NOT NULL,
    FirstName    STRING(1024),
    LastName     STRING(1024),
    SingerInfo   BYTES(MAX)
) PRIMARY KEY (SingerId);

CREATE TABLE Albums (
    SingerId     String(MAX) NOT NULL,
    AlbumId      String(MAX) NOT NULL,
    AlbumTitle   STRING(MAX)
) PRIMARY KEY (SingerId, AlbumId),
INTERLEAVE IN PARENT Singers ON DELETE CASCADE;
