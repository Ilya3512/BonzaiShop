import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./shop/Header/Header";
import Shop from "./shop/Shop";
import Contacts from "./contacts/Contacts";
import SingleItem from "./shop/Katalog/SingleItem";
import Delivery from "./delivery/Delivery";
import Whatisit from "./whatisit/Whatisitt"; 
import History from "./history_bonsai/History";
import Basket from "./basket/Basket";
import { CartProvider } from "./basket/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Shop />} />
              <Route path=":slug" element={<SingleItem />} />
              <Route path="delivery" element={<Delivery />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="whatisit" element={<Whatisit />} />
              <Route path="history" element={<History/>} />
              <Route path="basket" element={<Basket />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
