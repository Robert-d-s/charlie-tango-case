import Head from "next/head";
import styles from "@/pages/dashboard/dashboard.module.css";

// Mock data for demo purposes
const mockSellers = [
  {
    id: "1",
    name: "Lars Nielsen",
    email: "lars@example.dk",
    phone: "+4512345678",
    price: 3500000,
    zipCode: "2100",
    size: 120,
    estateType: "1",
    address: "Østerbrogade 123, 2100 København Ø",
    consent: true,
    buyers: [
      {
        id: "a3b8d425",
        maxPrice: 3600000,
        minSize: 110,
        adults: 2,
        children: 1
      },
      {
        id: "b4c9e530",
        maxPrice: 3400000,
        minSize: 100,
        adults: 2,
        children: 2
      }
    ]
  },
  {
    id: "2",
    name: "Maria Hansen",
    email: "maria@example.dk",
    phone: "+4587654321",
    price: 2800000,
    zipCode: "2200",
    size: 95,
    estateType: "4",
    address: "Nørrebrogade 456, 2200 København N",
    consent: true,
    buyers: [
      {
        id: "c5d0f635",
        maxPrice: 3000000,
        minSize: 80,
        adults: 1,
        children: 0
      }
    ]
  }
];

export async function getServerSideProps() {
  // Return mock data instead of Supabase call
  return { props: { sellers: mockSellers } };
}

export default function Sellers({ sellers }) {
  console.log("sellers prop:", sellers);
  return (
    <div className={styles.layout}>
      <Head>
        <title>Dashboard| EDC</title>
      </Head>
      <h1 className={styles.headline}>Dashboard</h1>

      {sellers.map((seller) => (
        <div key={seller.id} className={styles.sellerCard}>
          <div className={styles.seller}>
            <h2>Seller ID: {seller.id}</h2>

            <div className={styles.oneField}>
              <p>Id</p>
              <p>{seller.id}</p>
            </div>
            <div className={styles.oneField}>
              <p>Name</p>
              <p>{seller.name}</p>
            </div>
            <div className={styles.oneField}>
              <p>E-mail</p>
              <p>{seller.email}</p>
            </div>
            <div className={styles.oneField}>
              <p>Phone</p>
              <p>{seller.phone}</p>
            </div>
            <div className={styles.oneField}>
              <p>Price</p>
              <p>{seller.price}</p>
            </div>
            <div className={styles.oneField}>
              <p>Zip Code</p>
              <p>{seller.zipCode}</p>
            </div>
            <div className={styles.oneField}>
              <p>Size</p>
              <p>{seller.size}</p>
            </div>
            <div className={styles.oneField}>
              <p>Estate Type</p>
              <p>{seller.estateType}</p>
            </div>
          </div>
          <div className={styles.buyersCard}>
            <h2>Buyers</h2>
            {seller.buyers.map((buyer) => (
              <div key={buyer.id} className={styles.oneBuyer}>
                <div className={styles.oneField}>
                  <p>Buyer ID</p>
                  <p>{buyer.id}</p>
                </div>
                <div className={styles.oneField}>
                  <p>Max Price</p>
                  <p>{buyer.maxPrice}</p>
                </div>
                <div className={styles.oneField}>
                  <p>Max Size</p>
                  <p>{buyer.minSize}</p>
                </div>
                <div className={styles.oneField}>
                  <p>Adults</p>
                  <p>{buyer.adults}</p>
                </div>
                <div className={styles.oneField}>
                  <p>Children</p>
                  <p>{buyer.children}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
