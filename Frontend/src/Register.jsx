import React from "react";
import { useState, useEffect } from "react";
import styles from "./Register.module.css";
import axios from "axios";
import swal from "sweetalert2";
import { InfinitySpin, ThreeDots } from "react-loader-spinner";

const PhotoUploadForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    reason: "",
    photoUpload: null,
    resumeUpload: null,
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    const newValue = type === "file" ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const data_API = " http://localhost:3000/createUser";
  const upload_API = "http://localhost:3000/upload";

  // const data_API =
  //   " https://member-board-drive-backend.onrender.com/createUser";
  // const upload_API = "https://member-board-drive-backend.onrender.com/upload";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const { name, email, phone, branch, reason, photoUpload, resumeUpload } =
      formData;

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("phone", phone);
    formDataToSend.append("branch", branch);
    formDataToSend.append("reason", reason);
    // formDataToSend.append("photoUpload", photoUpload);
    // formDataToSend.append("resumeUpload", resumeUpload);

    setIsLoading(true);

    try {
      const data_Response = await axios.post(data_API, formDataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data_Response.status === 201) {
        try {
          formDataToSend.append("id", data_Response.data.id.toString());
          formDataToSend.append("photoUpload", photoUpload);
          formDataToSend.append("resumeUpload", resumeUpload);

          const upload_Response = await axios.post(upload_API, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (upload_Response.status === 201) {
            handleReset(event);
            swal.fire({
              title: "Registered Successfully!! Check email for confirmation.",
              imageHeight: 200,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Continue",
              imageUrl:
                "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066882/TechnoTweet/hurray_uptaef.png",
              customClass: {
                popup: "animated fadeInDown faster",
                confirmButton: "animated bounceIn faster",
                cancelButton: "animated bounceIn faster",
              },
            });
          }
        } catch (err) {}
      }
    } catch (err) {
      console.log(err);

      if (
        err.response.data.success === "false" &&
        err.response.data.message === "Email Already Registered"
      ) {
        swal.fire({
          title: "Email already registered!!! Try using different email.",
          imageUrl:
            "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066890/TechnoTweet/oops_qo58xk.png",
          imageHeight: 200,
          imageWidth: 200,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          animation: "true",
          customClass: {
            popup: "animated fadeInDown faster",
            confirmButton: "animated bounceIn faster",
            cancelButton: "animated bounceIn faster",
          },
        });
        return false;
      } else if (
        err.response.data.success === "false" &&
        err.response.data.message === "Invalid mobile number"
      ) {
        swal.fire({
          title: "Invalid mobile number",
          imageUrl:
            "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066890/TechnoTweet/oops_qo58xk.png",
          imageHeight: 300,
          imageWidth: 200,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          animation: "true",
          customClass: {
            popup: "animated fadeInDown faster",
            confirmButton: "animated bounceIn faster",
            cancelButton: "animated bounceIn faster",
          },
        });
      } else {
        swal.fire({
          title: "Something went wrong!! Try again after some time.",
          imageUrl:
            "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066890/TechnoTweet/oops_qo58xk.png",
          imageHeight: 300,
          imageWidth: 200,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          animation: "true",
          customClass: {
            popup: "animated fadeInDown faster",
            confirmButton: "animated bounceIn faster",
            cancelButton: "animated bounceIn faster",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (event) => {
    event.preventDefault();
    event.target.reset();
  };

  return (
    <div>
      <h1>Member Board Application</h1>
      <img
        className={styles.header_logo}
        src="https://i.ibb.co/7rTj4MT/white.png"
        loading="lazy"
        alt=""
      />

      <div className={styles.registration_container}>
        <div>
          <img
            className={styles.side_tux}
            loading="lazy"
            src="https://i.ibb.co/HBDyz7P/tux.png"
          ></img>
        </div>
        <div>
          <div>
            <div className={styles.form_container} id="register">
              <form
                className={styles.form}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                method="post"
              >
                <label htmlFor="name" className={styles.inputLabels}>
                  {" "}
                  Name{" "}
                </label>
                <input
                  required={true}
                  placeholder="Your Name"
                  name="name"
                  id="name"
                  type="text"
                  onChange={handleChange}
                />
                <label htmlFor="email" className={styles.inputLabels}>
                  {" "}
                  Email ID{" "}
                </label>
                <input
                  required={true}
                  placeholder="Your Email"
                  name="email"
                  id="email"
                  type="email"
                  onChange={handleChange}
                />
                <label htmlFor="phone" className={styles.inputLabels}>
                  {" "}
                  Phone Number{" "}
                </label>
                <input
                  required={true}
                  placeholder="Your Phone Number"
                  minLength={10}
                  maxLength={10}
                  name="phone"
                  id="phone"
                  type="tel"
                  onChange={handleChange}
                />

                <label htmlFor="branch" className={styles.inputLabels}>
                  {" "}
                  Branch{" "}
                </label>
                <br />

                <div className={styles.selectdropdown}>
                  <select
                    id="branch"
                    name="branch"
                    required={true}
                    onChange={handleChange}
                    className={styles.mySelectArrow}
                    defaultValue=""
                  >
                    <option value="" disabled defaultValue hidden>
                      Select your option
                    </option>
                    <option value="Computer_Science_Engineering">
                      Computer Science Engineering
                    </option>
                    <option value="Information_Technology">
                      Information Technology
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>

                <label htmlFor="reason" className={styles.inputLabels}>
                  {" "}
                  Why do you want to join WLUG ?{" "}
                </label>
                <input
                  required={true}
                  placeholder="Reasons"
                  name="reason"
                  id="reason"
                  type="text"
                  onChange={handleChange}
                />

                <label htmlFor="photoUpload" className={styles.inputLabels}>
                  {" "}
                  Upload your Photo{" "}
                </label>
                <input
                  required={true}
                  name="photoUpload"
                  id="photoUpload"
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  onChange={handleChange}
                />

                <label htmlFor="resumeUpload" className={styles.inputLabels}>
                  {" "}
                  Upload your Resume (.pdf File only){" "}
                </label>
                <input
                  required={true}
                  name="resumeUpload"
                  id="resumeUpload"
                  type="file"
                  accept=".pdf"
                  onChange={handleChange}
                />

                <div className={styles.submitSection}>
                  {!isLoading && (
                    <div className={styles.submitButton}>
                      <input
                        type="submit"
                        defaultValue="Apply Now"
                        className="button"
                        value="Apply Now"
                      />
                    </div>
                  )}
                  {/* {isLoading && (
                          <div className={styles.submitButton}>
                              <ThreeDots
                                  height="80"
                                  width="80"
                                  radius="9"
                                  color="#4fa94d"
                                  ariaLabel="three-dots-loading"
                                  wrapperStyle={{}}
                                  wrapperClassName=""
                                  visible={true}
                              />
                          </div>
                      )} */}
                  {isLoading && (
                    <div className={styles.submitButton} id="loader">
                      <InfinitySpin width="100" color="#ffaa00" />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadForm;
