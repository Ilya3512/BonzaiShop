import { Katalog } from "./Katalog/Katalog";
import Slaider from "./Slaider/Slaider";

function Shop() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Slaider />
      <Katalog />
    </div>
  );
}
export default Shop;
