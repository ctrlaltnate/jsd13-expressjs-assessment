import express from "express";

import {products} from "../../productsDB/products.js";

const router = express.Router();

// READ products --all--
router.get("/", (req, res) => {
  res.json(products);
});


// READ products --by id--
router.get("/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});


// create products
router.post("/", (req, res) => {
  const {name, price, quantity} = req.body;
  if ( !name || !price ||!quantity) {
    return res.status(400).json({
      error: "Missing required fields, Please provide name , price and qunatities",
    });
  }

  const highestId = products.reduce(
    (max, product) => Math.max(max, Number(product.id)),
    0,
  );

  const newProduct = {
    id: String(highestId + 1),
    name,
    price,
    quantity,
  };
  products.push(newProduct);

  return res.status(201).json(newProduct);
});

//update products
router.put("/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: "product to updating is not found!, please recheck id" });
    }

    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res
        .status(400)
        .json({ error: "name of product , price and quntity are required!" });
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    const index = products.indexOf(product);
    products.splice(index, 1);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;