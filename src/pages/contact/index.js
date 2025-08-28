import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import styles from "./Contact.module.css";
import { estateTypes } from "@/data/estateTypes";

export default function Contact() {
  const formEl = useRef(null);
  const { query } = useRouter();
  const router = useRouter();

  function submitted(e) {
    e.preventDefault();
    console.log({ buyers });

    const payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      price: query.price,
      estateType: estateTypes[query.estate_type - 1].name,
      size: query.size,
      zipCode: query.zipcode,
      buyers: buyers,
    };

    fetch("/api/addSellers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        router.push("/thanks");
      });
  }

  console.log({ query });

  const [buyers, setBuyers] = useState([]);
  useEffect(() => {
    if (query.id) {
      // Ensure query.id is always an array
      const idsArray = Array.isArray(query.id) ? query.id : [query.id];
      setBuyers(idsArray.map(JSON.parse));
    }
  }, [query.id]);

  console.log("buyers:", buyers);
  function deleteBuyer(id) {
    setBuyers((prev) => prev.filter((buyer) => buyer.id !== id));
  }

  function getEstateTypeName(id) {
    //goes through the object and returns the first element in the provided array
    const estateTypeName = estateTypes.find((x) => x.id === id);
    return estateTypeName ? estateTypeName.name : null;
  }
  // _______________________1_
  return (
    <>
      <Head>
        <title>Contact | EDC</title>
      </Head>
      <div className={styles.layout}>
        <h1 className={styles.headline}>Potential buyers</h1>
        <form className={styles.form} ref={formEl} onSubmit={submitted}>
          <label className={styles.label}>
            Name
            <input type="text" name="name" required />
          </label>

          <label className={styles.label}>
            Email
            <input type="email" name="email" required />
          </label>
          <label className={styles.label}>
            Phone Number
            <input type="tel" name="phone" required />
          </label>
          <label className={`${styles.label} ${styles.checkboxRow}`}>
            <input
              type="checkbox"
              name="offersAndInfo"
              className={styles.checkbox_form}
            />
            <span>
              Yes please, EDC may contact me with offers and information related
              to the real estate market.
            </span>
          </label>
          <button className={styles.button} type="submit">
            Contact buyers
          </button>
        </form>
        <div className={styles.content}>
          <ul>
            {buyers.map((buyer) => (
              <li key={buyer.id} className={styles.card}>
                <div className={styles.head}>
                  <div className={styles.card_id}>
                    <p className={styles.icon_ID}>ID:</p>
                    <p className={styles.idValue}>{buyer.id}</p>
                  </div>
                  <button
                    className={styles.closeButton}
                    onClick={() => deleteBuyer(buyer.id)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.deets}>
                  <div>
                    <div className={styles.card_content}>
                      <p className={styles.icon_boligtype}>Estate Type</p>
                      <p>{getEstateTypeName(buyer.estateType)}</p>
                    </div>
                    <div className={styles.card_content}>
                      <p className={styles.icon_calendar}>Takeover Date</p>
                      <p>{buyer.takeoverDate}</p>
                    </div>
                    <div className={styles.card_content}>
                      <p className={styles.icon_family}>Adults</p>
                      <p>{buyer.adults}</p>
                    </div>
                  </div>
                  <div>
                    <div className={styles.card_content}>
                      <p className={styles.icon_family}>Children</p>
                      <p>{buyer.children}</p>
                    </div>
                    <div className={styles.card_content}>
                      <p className={styles.icon_min_area}>Min Size</p>
                      <p>{buyer.minSize} m²</p>
                    </div>
                    <div className={styles.card_content}>
                      <p className={styles.icon_budget}>Max Price</p>
                      <p>{buyer.maxPrice} DKK</p>
                    </div>
                  </div>
                </div>
                <div className={styles.desc}>
                  <p>Description</p>
                  <p>{buyer.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
