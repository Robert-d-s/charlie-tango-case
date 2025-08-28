import styles from "@/pages/Home.module.css";
import { estateTypes } from "@/data/estateTypes";
import { useRouter } from "next/router";
import { useState } from "react";
import AddressInput from "./AddressInput";

export default function IndexForm() {
  const router = useRouter();
  const [addressData, setAddressData] = useState(null);
  const [zipCodeValid, setZipCodeValid] = useState(null);
  const [cityName, setCityName] = useState("");

  const validateZipCode = async (zipCode) => {
    if (zipCode.length === 4) {
      try {
        const response = await fetch(`https://api.dataforsyningen.dk/postnumre/${zipCode}`);
        if (response.ok) {
          const data = await response.json();
          setZipCodeValid(true);
          setCityName(data.navn);
        } else {
          setZipCodeValid(false);
          setCityName("");
        }
      } catch (error) {
        setZipCodeValid(false);
        setCityName("");
      }
    } else {
      setZipCodeValid(null);
      setCityName("");
    }
  };

  const handleZipCodeChange = (event) => {
    const zipCode = event.target.value;
    if (zipCode.length === 4 && /^\d{4}$/.test(zipCode)) {
      validateZipCode(zipCode);
    } else {
      setZipCodeValid(null);
      setCityName("");
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    setAddressData(selectedAddress);
    setZipCodeValid(true);
    setCityName(selectedAddress.city);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const query = {
      price: formData.get("price"),
      size: formData.get("size"),
      zipCode: addressData?.zipCode || formData.get("zipCode"),
      estateType: formData.get("estateType"),
      address: addressData?.fullAddress || formData.get("address"),
    };

    router.push({
      pathname: "/buyers",
      query,
    });
  };

  // action="/buyers" method="GET"

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        <span className={styles.label}>Price</span>
        <input name="price" required />
      </label>
      <label>
        <span className={styles.label}>Size</span>
        <input name="size" required />
      </label>
      <label>
        <span className={styles.label}>Address (with autocomplete)</span>
        <AddressInput 
          name="address"
          onAddressSelect={handleAddressSelect}
          required
        />
        {cityName && (
          <span className={styles.cityName} style={{ color: 'green', fontSize: '0.9em', marginTop: '4px', display: 'block' }}>
            📍 {cityName} ({addressData?.zipCode})
          </span>
        )}
      </label>
      
      <label>
        <span className={styles.label}>Or just Zip Code</span>
        <input 
          name="zipCode" 
          maxLength="4"
          pattern="\d{4}"
          onChange={handleZipCodeChange}
          placeholder="2100 (fallback if address not selected)"
          style={{
            borderColor: zipCodeValid === false ? 'red' : zipCodeValid === true ? 'green' : '',
          }}
        />
        {zipCodeValid === false && (
          <span style={{ color: 'red', fontSize: '0.9em' }}>
            Invalid postal code
          </span>
        )}
      </label>
      <label>
        <span className={styles.label}>Estate type</span>
        <select name="estateType" required>
          {estateTypes.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <button className={styles.button}>Find potential buyers</button>
    </form>
  );
}
