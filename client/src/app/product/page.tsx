"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getAllProducts, getUserDetail, updateProd } from "../../services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface LogData {
  _id: string;
  oldValue: {
    productName: string;
    price: number;
    description: string;
    offer: string;
  };
  newValue: {
    productName: string;
    price: number;
    description: string;
    offer: string;
  };
  userId: string;
  timestamp: string;
}
interface UserData {
  _id: string;
  email: string;
  createdAt: string;
}
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Product() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);

  const [token, setToken] = useState<{} | null>(null);

  const [productUpdateDialog, setProductUpdateDialog] = useState(false);

  const [productName, setProductName] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [desc, setDesc] = useState<string | null>(null);
  const [offer, setOffer] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        const { data }: any = await getAllProducts(token);
        setProducts(data);
      };
      fetchData();
    } else {
      const authDataString = localStorage.getItem("auth");
      const data = authDataString ? JSON.parse(authDataString) : null;
      if (data) {
        setToken(data.access_token);
      } else {
        router.push("/login");
      }
    }
  }, [router, token]);

  const updateProductHandler = async (data: any) => {
    setProductUpdateDialog(true);
    setProduct(data);
  };
  const updateProduct = async () => {
    let oldValue = {
      productName: product.productName,
      price: product.price,
      description: product.description,
      offer: product.offer,
    };
    await updateProd(
      product._id,
      productName ? productName : product.productName,
      price ? price : product.price,
      desc ? desc : product.description,
      offer ? offer : product.offer,
      product,
      token
    );
    window.location.reload();
  };
  return (
    <main className="container flex flex-row  bg-slate-600">
      <div className="container  h-screen ">
        <div className="mt-10  p-8">
          <div className="flex flex-row justify-between items-center mb-4 ">
            <h1 className="text-lg font-bold text-white p-2 uppercase">
              Logs will be displayed here
            </h1>
            <div className="flex flex-row items-center gap-2">
              <Button
                onClick={() => {
                  router.push("/");
                }}
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                View The Logs
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                variant="default"
                className=""
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="table-container border-collapse border-0 border-red-200/20  backdrop-blur-xl">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Created At
                  </th>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Product ID
                  </th>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Product Name
                  </th>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Product Price
                  </th>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Description
                  </th>
                  <th className="border text-white border-white/20 px-4 w-40 py-2">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {products?.length > 0 ? (
                  products.map((data: any, index) => (
                    <tr key={index}>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">
                          {new Date(data?.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">{data?._id}</p>
                      </td>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">
                          {data?.productName}
                        </p>
                      </td>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">{data?.price}</p>
                      </td>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">
                          {data?.description}
                        </p>
                      </td>
                      <td className="flex flex-row border-r border-b border-white/20 gap-4 justify-center text-center p-3 items-center">
                        <Button
                          onClick={() => updateProductHandler(data)}
                          variant="secondary"
                          className="text-xs bg-black/60 text-white"
                          size="sm"
                        >
                          Update product
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-white text-center py-4">
                      Please create product
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={productUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>
              Click on save when you are done
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-4 ml-10">
                <div className="flex flex-col items-start space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Product name"
                    required
                    type="text"
                    value={productName ? productName : product?.productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-64 px-4 py-2 rounded-md border border-stone-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <Label>Price</Label>
                  <Input
                    required
                    placeholder="Price"
                    type="text"
                    value={price ? price : product?.price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-64 px-4 py-2 rounded-md border border-stone-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Description"
                    required
                    type="text"
                    value={desc ? desc : product?.description}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-64 px-4 py-2 rounded-md border border-stone-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <Label>Offer</Label>
                  <Input
                    required
                    placeholder="Offer"
                    type="text"
                    value={offer ? offer : product?.offer}
                    onChange={(e) => setOffer(e.target.value)}
                    className="w-64 px-4 py-2 rounded-md border border-stone-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="default"
              onClick={() => updateProduct()}
            >
              Update
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setProductUpdateDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
