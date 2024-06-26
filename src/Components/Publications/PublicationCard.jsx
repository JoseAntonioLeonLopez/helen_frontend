import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const PublicationCard = ({ publication, user, liked, likes, onLikeClick, showLikeButton }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card" style={{ marginBottom: "15px" }}>
        {publication && (
          <div className="publication-image-container" style={{ width: "100%", height: "300px", overflow: "hidden", marginBottom: "10px" }}>
            <img
              src={publication.image}
              style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: "300px" }}
              alt={publication.title}
            />
          </div>
        )}
        <div className="card-body">
          <p className="card-text">
            {user && (
              <span>
                {user.imageUser ? (
                  <img
                    src={user.imageUser}
                    alt="Imagen de perfil"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                ) : (
                  <img
                    src="/img/user-avatar.svg"
                    alt="Imagen de perfil predeterminada"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                )}
                <span>{user.username}</span>
              </span>
            )}
          </p>
          {publication && (
            <React.Fragment>
              <small className="text-muted">{publication.city}</small>
              <h5 className="card-title">{publication.title}</h5>
              <p className="card-text">{publication.description}</p>
            </React.Fragment>
          )}
          {/* Renderizar botón de like con el número de likes si showLikeButton es true */}
          {showLikeButton && (
            <button
              onClick={onLikeClick}
              style={{
                color: liked ? "red" : "black",
              }}
            >
              <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
              <b className="pl-2">{likes}</b>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;
