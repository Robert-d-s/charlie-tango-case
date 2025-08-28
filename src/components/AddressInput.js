import { useCombobox } from "downshift";
import { useState, useEffect } from "react";
import styles from "@/pages/Home.module.css";

export default function AddressInput({
  onAddressSelect,
  name = "address",
  required = false,
}) {
  const [inputItems, setInputItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async (inputValue, caretPos) => {
    if (!inputValue || inputValue.length < 3) {
      setInputItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.dataforsyningen.dk/autocomplete?type=adresse&q=${encodeURIComponent(
          inputValue
        )}&caretpos=${caretPos}`
      );
      if (response.ok) {
        const suggestions = await response.json();
        setInputItems(suggestions.slice(0, 8)); // Limit to 8 suggestions
      } else {
        setInputItems([]);
      }
    } catch (error) {
      console.error("Address search error:", error);
      setInputItems([]);
    }
    setLoading(false);
  };

  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? item.tekst : ""),
    onInputValueChange: ({ inputValue, isOpen, type }) => {
      // Only fetch when user is typing
      if (type === useCombobox.stateChangeTypes.InputChange) {
        fetchAddresses(inputValue, inputValue?.length || 0);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem && onAddressSelect) {
        // Extract zip code and other data from the selected address
        const addressData = {
          fullAddress: selectedItem.tekst,
          zipCode: selectedItem.data.postnr,
          city: selectedItem.data.postnrnavn,
          streetName: selectedItem.data.vejnavn,
          houseNumber: selectedItem.data.husnr,
          coordinates: {
            x: selectedItem.data.x,
            y: selectedItem.data.y,
          },
        };
        onAddressSelect(addressData);
      }
    },
  });

  return (
    <div style={{ position: "relative" }}>
      <input
        {...getInputProps({
          name,
          required,
          placeholder: "Start typing an address...",
        })}
      />

      {loading && (
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Searching...
        </div>
      )}

      <ul
        {...getMenuProps()}
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: isOpen && inputItems.length > 0 ? "1px solid #ccc" : "none",
          borderRadius: "4px",
          boxShadow:
            isOpen && inputItems.length > 0
              ? "0 2px 8px rgba(0,0,0,0.1)"
              : "none",
          zIndex: 1000,
          maxHeight: "200px",
          overflowY: "auto",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={item.data.id}
              {...getItemProps({ item, index })}
              style={{
                backgroundColor:
                  highlightedIndex === index ? "#f0f0f0" : "white",
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom:
                  index < inputItems.length - 1 ? "1px solid #eee" : "none",
                fontSize: "14px",
              }}
            >
              {item.forslagstekst}
            </li>
          ))}
      </ul>
    </div>
  );
}
