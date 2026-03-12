import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  Params,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = [
    {
      id: "trj-crd",
      name: "Tarjeta de Crédito",
      description: "Tarjeta de consumo bajo la modalidad de crédito",
      logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
      date_release: new Date("2023-02-01"),
      date_revision: new Date("2024-02-01")
    },
    {
      id: "cta-ah",
      name: "Cuenta de Ahorros",
      description: "Cuenta bancaria diseñada para guardar dinero y generar intereses.",
      logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
      date_release: new Date("2026-03-01"),
      date_revision: new Date("2026-03-11")
    },
    {
      id: "prest-per",
      name: "Préstamo Personal",
      description: "Crédito otorgado a personas para libre inversión.",
      logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
      date_release: new Date("2026-03-01"),
      date_revision: new Date("2026-03-11")
    },
    {
      id: "inv-fond",
      name: "Fondo de Inversión",
      description: "Instrumento financiero para invertir en diferentes activos.",
      logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
      date_release: new Date("2026-03-01"),
      date_revision: new Date("2026-03-11")
    },
    {
      id: "seg-vida",
      name: "Seguro de Vida",
      description: "Cobertura financiera ante fallecimiento o incapacidad.",
      logo: '',
      date_release: new Date("2026-03-01"),
      date_revision: new Date("2026-03-11")
    },
    {
      id: "seg-vida-2",
      name: "Seguro de Vida 2",
      description: "Cobertura financiera ante fallecimiento o incapacidad.",
      logo: '',
      date_release: new Date("2026-03-01"),
      date_revision: new Date("2026-03-11")
    }
  ];

  @Get("")
  getAll() {
    return {
      data: [...this.products],
    };
  }

  @Get("/verification/:id")
  verifyIdentifier(@Param("id") id: number | string) {
    return this.products.some((product) => product.id === id);
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return this.products.find((product) => product.id === id);
  }

  @Post("")
  createItem(@Body({ validate:true }) productItem: ProductDTO) {
    
    const index = this.findIndex(productItem.id);

    if(index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }
    
    this.products.push(productItem);
    return {
      message: "Product added successfully",
      data: productItem,
    };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body() productItem: ProductInterface) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products[index] = {
      ...this.products[index],
      ...productItem,
    };
    return {
      message: "Product updated successfully",
      data: productItem,
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
        
    this.products = [...this.products.filter((product) => product.id !== id)];
    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    return this.products.findIndex((product) => product.id === id);
  }

}
