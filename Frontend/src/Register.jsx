import React from "react";
import { useState, useEffect } from "react";
import styles from "./Register.module.css";
import axios from "axios";
import swal from "sweetalert2";
import { InfinitySpin, ThreeDots } from "react-loader-spinner";

const Register = () => {
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

  // const data_API = " http://localhost:3000/createUser";
  // const upload_API = "http://localhost:3000/upload";

  const data_API = "https://member-board-drive-backend.onrender.com/createUser";
  const upload_API = "https://member-board-drive-backend.onrender.com/upload";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, phone, branch, reason, photoUpload, resumeUpload } =
      formData;

    const photoUploadExt = photoUpload.name.split(".").pop().toString();

    if (
      photoUploadExt !== `jpg` &&
      photoUploadExt !== `png` &&
      photoUploadExt !== `jpeg`
    ) {
      sendAlert({
        title: "Upload Image file only!",
        buttonText: "OK",
        imageUrl: "https://i.ibb.co/pzbNyjQ/image.png",
      });

      return false;
    }

    if (resumeUpload.name.split(".").pop() != "pdf") {
      sendAlert({
        title: "Upload PDF file only!",
        buttonText: "OK",
        imageUrl: "https://i.ibb.co/4SJdCkt/pdf.png",
      });

      return false;
    }

    if (photoUpload.size > 1000000) {
      sendAlert({
        title: "Photo size too large! Max Size 1MB",
        buttonText: "OK",
        imageUrl: "https://i.ibb.co/zfrXVzB/large.png",
      });

      return false;
    }
    if (resumeUpload.size > 2000000) {
      sendAlert({
        title: "Resume size too large! Max Size 2MB",
        buttonText: "OK",
        imageUrl: "https://i.ibb.co/zfrXVzB/large.png",
      });

      return false;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("phone", phone);
    formDataToSend.append("branch", branch);
    formDataToSend.append("reason", reason);

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
            sendAlert({
              title: "Registered Successfully!",
              buttonText: "Continue",
              imageUrl:
                "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066882/TechnoTweet/hurray_uptaef.png",
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
        sendAlert({
          title: "Email already registered! Try using different email.",
          buttonText: "OK",
          imageUrl:
            "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066890/TechnoTweet/oops_qo58xk.png",
        });

        return false;
      } else {
        sendAlert({
          title: "Something went wrong!! Try again after some time.",
          buttonText: "OK",
          imageUrl:
            "https://res.cloudinary.com/dizrxbb27/image/upload/v1681066890/TechnoTweet/oops_qo58xk.png",
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

  const sendAlert = ({
    title,
    buttonText,
    imageUrl,
    imageHeight = 200,
    imageWidth = 200,
  }) => {
    swal.fire({
      title: title,
      imageUrl: imageUrl,
      imageHeight: imageHeight,
      imageWidth: imageWidth,
      confirmButtonColor: "#3085d6",
      confirmButtonText: buttonText,
      animation: "true",
      customClass: {
        popup: "animated fadeInDown faster",
        confirmButton: "animated bounceIn faster",
        cancelButton: "animated bounceIn faster",
      },
    });
  };

  return (
    <div>
      <div className={styles.header_logo_container}>
        <img
          className={styles.header_logo}
          src="https://i.ibb.co/7rTj4MT/white.png"
          loading="lazy"
          alt=""
        />
      </div>
      <h1>Member Board Application</h1>
      <div style={{ padding: "10px" }}>
        <div className={styles.registration_container}>
          <div>
            <img
              className={styles.side_tux}
              loading="lazy"
              src="https://i.ibb.co/HBDyz7P/tux.png"
            ></img>
          </div>
          <div>
            <div className={styles.tuxy_container}>
              <img
                className={styles.top_tux}
                loading="lazy"
                src="https://i.ibb.co/HBDyz7P/tux.png"
              ></img>
            </div>

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
                    Contact number{" "}
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
                      <option value="Computer Science Engineering">
                        Computer Science Engineering
                      </option>
                      <option value="Information Technology">
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
                    Upload your photo{" "}
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
                    Upload your resume (.pdf file only){" "}
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
                      <button
                        type="submit"
                        className={`${styles.button_slide} ${styles.slide_right}`}
                      >
                        APPLY
                      </button>
                      // <div
                      //   className={`${styles.button_slide} ${styles.slide_right}`}
                      // >
                      //   <input
                      //     type="submit"
                      //     defaultValue="Apply Now"
                      //     className="button"
                      //     value="Apply Now"
                      //   />
                      // </div>
                    )}
                    {isLoading && (
                      <div className={styles.infinityLoop} id="loader">
                        <ThreeDots
                          height="80"
                          width="80"
                          // radius="9"
                          color="var(--color-primary)"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClassName=""
                          visible={true}
                        />
                        {/* <InfinitySpin
                          width="200"
                          height
                          color="var(--color-primary)"
                        /> */}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
