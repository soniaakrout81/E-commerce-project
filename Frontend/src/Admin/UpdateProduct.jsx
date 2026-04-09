import React, { useState, useEffect } from "react";
import "../AdminStyles/UpdateProduct.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { removeSuccess, updateProduct } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function UpdateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, products } = useSelector((state) => state.admin);
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  useEffect(() => {
    dispatch(removeSuccess());
  }, [dispatch]);

  useEffect(() => {
    const product = products.find((p) => p._id === id);
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setKeywords(product.keywords || "");
      setStock(product.stock || "");
      setOldImages(product.image || []);
    }
  }, [id, products]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setImagePreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImage((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("keywords", keywords);
    myForm.set("stock", stock);
    image.forEach((img) => {
      myForm.append("image", img);
    });

    try {
      await dispatch(updateProduct({ id, formData: myForm })).unwrap();
      toast.success(t("admin.products.updated"), { position: "top-center", autoClose: 2500 });
      navigate("/admin/products");
    } catch {
      toast.error(t("admin.products.updateFailed"), { position: "top-center", autoClose: 3000 });
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <PageTitle title={t("admin.products.updateProduct")} />

      <div className="update-product-wrapper">
        <h1 className="update-product-title">{t("admin.products.updateProduct")}</h1>
        <form className="update-product-form" onSubmit={handleProductSubmit}>
          <div className="update-product-fields">
            <label htmlFor="name">{t("admin.products.productName")}</label>
            <input type="text" className="update-product-input" required id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="price">{t("admin.products.productPrice")}</label>
            <input type="number" className="update-product-input" required id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} />

            <label htmlFor="description">{t("admin.products.productDescription")}</label>
            <textarea className="update-product-textarea" required id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <label htmlFor="keywords">{t("admin.products.productKeywords")}</label>
            <input type="text" className="update-product-input" id="keywords" name="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />

            <label htmlFor="stock">{t("admin.products.productStock")}</label>
            <input type="number" className="update-product-input" required id="stock" name="stock" value={stock} onChange={(e) => setStock(e.target.value)} />

            <div className="file-input-wrapper">
              <input type="file" id="update-product-images" accept="image/*" multiple onChange={handleImageChange} />
              <label htmlFor="update-product-images" className="file-input-label">{t("admin.products.chooseImages")}</label>
            </div>

            {imagePreview.length > 0 && (
              <div className="update-product-preview-wrapper">
                {imagePreview.map((img, index) => (
                  <img src={img} key={index} alt={t("admin.products.newPreview")} className="update-product-preview-image" />
                ))}
              </div>
            )}

            {oldImages.length > 0 && (
              <div className="update-product-old-images-wrapper">
                {oldImages.map((img, index) => (
                  <img src={img.url} key={index} alt={t("admin.products.oldImage")} className="update-product-old-image" />
                ))}
              </div>
            )}

            <button className="update-product-submit-btn">{t("common.update")}</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateProduct;
