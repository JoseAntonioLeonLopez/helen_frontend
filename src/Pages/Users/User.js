import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../../Constants/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Swal from "sweetalert2";
import './User.css';
import { Image } from 'primereact/image';

function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({}); // Nuevo estado para almacenar los likes de las publicaciones

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub;
          const response = await axios.get(
            `${API_URL}/users/username/${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
          setLoading(false);

          // Actualizar los likes de las publicaciones
          const likesMap = response.data.usersPublications.reduce((acc, publication) => {
            acc[publication.idPublication] = publication.favorites.length;
            return acc;
          }, {});
          setLikes(likesMap);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (publicationId) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta publicación?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              const token = sessionStorage.getItem("token");
              const response = await axios.delete(
                `${API_URL}/publications/${publicationId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              if (response.status === 200) {
                setUser((prevUser) => ({
                  ...prevUser,
                  usersPublications: prevUser.usersPublications.filter(
                    (publication) => publication.idPublication !== publicationId
                  ),
                }));
              
                // Mostrar tostada de éxito
                toast.success("Publicación borrada exitosamente", {
                  position: "top-right",
                });
              } else {
                throw new Error("Error al eliminar la publicación");
              }
            } catch (error) {
              console.error("Error deleting publication:", error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al eliminar la publicación. Por favor, inténtalo de nuevo más tarde.',
              });
            }
          }
        },
        {
          label: 'No',
          onClick: () => {} // No hace nada, solo cierra la ventana modal
        }
      ]
    });
  };   

  return (
    <div className="mt-4 mb-4">
      {loading ? (
        <div className="row">
          <div className="col-md-12 text-center">
            <p>Cargando...</p>
          </div>
        </div>
      ) : user ? (
        <div className="row">
          <div className="col-md-12 infoUser">
            <div className="d-flex align-items-center mb-4">
              <div>
                <img
                  src={user.imageUser ? user.imageUser : "/img/user-avatar.svg"}
                  alt="Perfil"
                  style={{
                    background: "white",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="ms-3">
                <div>
                  <p>
                    <b>Usuario:</b> {user.username}
                  </p>
                  <p>
                    <b>Email:</b> {user.email}
                  </p>
                  <p>
                    <b>Ciudad:</b> {user.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            {user.usersPublications.length > 0 ? (
              <div className="row">
                {user.usersPublications.map((publication, index) => (
                  <div
                    key={publication.idPublication}
                    className="col-md-4 mb-4"
                  >
                    <div className="card">
                    <Image src={publication.image}  alt={publication.title} preview />
                      <div className="card-body">
                        <p className="card-text">
                          <small className="text-muted">
                            {publication.city}
                          </small>
                        </p>
                        <h5 className="card-title">{publication.title}</h5>
                        <p className="card-text">{publication.description}</p>
                        {/* Mostrar el número de likes de la publicación */}
                        <div className="mb-3">
                            <FontAwesomeIcon
                              icon={solidHeart}
                              className="mr-1"
                            />
                            {likes[publication.idPublication]}
                          </div>
                        <div className="align-items-center">
                          <button
                            onClick={() =>
                              handleDelete(publication.idPublication)
                            }
                            className="btn btn-danger"
                          >
                            Eliminar
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Agregar divs vacíos para mantener la estructura de filas */}
                {user.usersPublications.length % 3 === 1 && (
                  <div className="col-md-4 mb-4"></div>
                )}
                {user.usersPublications.length % 3 === 2 && (
                  <div className="col-md-4 mb-4"></div>
                )}
              </div>
            ) : (
              <div className="col-md-12 text-center">
                <p>No hay publicaciones disponibles</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12 text-center">
            <p>No se pudo cargar la información del usuario.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;