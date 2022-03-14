import { Injectable } from '@angular/core';
import {
  ICatSubCatHolder,
  IEditProductCategory,
  IEditProductImages,
  IEditProductTag,
  IEditProductVariant,
  IEditProductVariantImages,
  INameValuePair,
  IPages,
  IProduct,
  IProductAddVariants,
  IProductAllList,
  IProductAttributeList,
  IProductByID,
  IProductCategoryList,
  IProductList,
  IProductStatus,
  IProductTag,
  IProductVariantImageChange,
  IVariantsOfProduct,
} from '@reactor-room/itopplus-model-lib';
import { IDObject, IMoreImageUrlResponse, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private apollo: Apollo, private pageService: PagesService) {}

  generateProductShareableLink(fbPageID: string, ref: string): string {
    return fbPageID && ref ? `http://m.me/${fbPageID}?ref=${ref}` : 'No sharable link available. Please contact support.';
  }

  getCurrentFBPageID(): Observable<IPages> {
    return this.pageService.currentPage$.pipe(
      switchMap(() => {
        return this.pageService.getPageByID();
      }),
    );
  }

  getShareableLink(fbPageID: string, ref: string): string {
    return this.generateProductShareableLink(fbPageID, ref);
  }

  getProductStatus(): Observable<IProductStatus[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductStatus {
            getProductStatus {
              id
              name
            }
          }
        `,
      })
      .pipe(map((response) => response.data['getProductStatus']));
  }

  getProductTag(): Observable<IProductTag[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductTag {
            getProductTag {
              id
              name
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductTag']));
  }

  getProductTagManagement(filters: ITableFilter): Observable<IProductTag[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductTagManagement($filters: ProductFilterInput) {
            getProductTagManagement(filters: $filters) {
              id
              name
              totalrows
            }
          }
        `,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductTagManagement']));
  }
  getProductList(filters: ITableFilter): Observable<IProductList[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductList($filters: TableFilterInput) {
            getProductList(filters: $filters) {
              id
              name
              status
              statusValue
              sold
              inventory
              maxUnitPrice
              minUnitPrice
              variants
              ref
              images {
                mediaLink
              }
              totalrows
            }
          }
        `,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductList']));
  }

  ////:: marketplace functionality commenting now
  // getProductAllList(filters: ITableFilter): Observable<IProductAllList[]> {
  //   return this.apollo
  //     .query({
  //       query: gql`
  //         query getProductAllList($filters: TableFilterInput) {
  //           getProductAllList(filters: $filters) {
  //             id
  //             name
  //             status
  //             statusValue
  //             sold
  //             inventory
  //             reserved
  //             maxUnitPrice
  //             minUnitPrice
  //             variants
  //             ref
  //             images {
  //               mediaLink
  //             }
  //             totalrows
  //             active
  //             marketPlaceType
  //             marketPlaceID
  //             marketPlaceProductID
  //             mergedProductData {
  //               mergedMarketPlaceID
  //               mergedMarketPlaceType
  //               mergedVariants {
  //                 marketPlaceVariantID
  //                 marketPlaceVariantType
  //                 marketPlaceVariantSku
  //               }
  //             }
  //             isMerged
  //           }
  //         }
  //       `,
  //       variables: {
  //         filters,
  //       },
  //       fetchPolicy: 'no-cache',
  //     })
  //     .pipe(map((response) => response.data['getProductAllList']));
  // }

  getProductAllList(filters: ITableFilter): Observable<IProductAllList[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductAllList($filters: TableFilterInput) {
            getProductAllList(filters: $filters) {
              id
              name
              status
              statusValue
              sold
              inventory
              reserved
              maxUnitPrice
              minUnitPrice
              variants
              ref
              images {
                mediaLink
              }
              totalrows
              active
            }
          }
        `,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductAllList']));
  }

  getProductTagSearch(name: string): Observable<IProductTag[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductTagSearch($name: String) {
            getProductTagSearch(name: $name) {
              id
              name
            }
          }
        `,
        variables: {
          name,
        },
      })
      .pipe(map((x) => x.data['getProductTagSearch']));
  }

  getProductCategoryList(): Observable<IProductCategoryList[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductCategoryList {
            getProductCategoryList {
              categoryID
              category
              subCategories {
                subCategoryID
                subCategory
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getProductCategoryList']));
  }

  getProductCategoryManagement(filters: ITableFilter): Observable<IProductCategoryList[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getProductCategoryManagement($filters: ProductFilterInput) {
            getProductCategoryManagement(filters: $filters) {
              categoryID
              category
              subCategories {
                subCategoryID
                subCategory
              }
              totalrows
            }
          }
        `,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(map((x) => x.data['getProductCategoryManagement']));
  }

  getProductAttributeManagement(filters: ITableFilter): Observable<IProductAttributeList[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getProductAttributeManagement($filters: ProductFilterInput) {
            getProductAttributeManagement(filters: $filters) {
              attributeID
              attributeName
              totalrows
              subAttributes {
                subAttributeID
                subAttributeName
              }
            }
          }
        `,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(map((x) => x.data['getProductAttributeManagement']));
  }

  getProductAttributeList(): Observable<IProductAttributeList[]> {
    return this.apollo
      .query({
        query: gql`
          query getProductAttributeList {
            getProductAttributeList {
              attributeID
              attributeName
              subAttributes {
                subAttributeID
                subAttributeName
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getProductAttributeList']));
  }

  addProductCategory(categoryData: IProductCategoryList[]): Observable<IHTTPResult> {
    const addCategory = this.apollo.mutate({
      mutation: gql`
        mutation addProductCategory($categoryData: [ProductCategoryInput]) {
          addProductCategory(categoryData: $categoryData) {
            status
            value
          }
        }
      `,
      variables: {
        categoryData,
      },
      fetchPolicy: 'no-cache',
    });
    return addCategory.pipe(map((x) => x.data['addProductCategory']));
  }

  searchProductSKU(name: string): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query searchProductSKU($name: String) {
            searchProductSKU(name: $name) {
              status
              value
            }
          }
        `,
        variables: {
          name,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['searchProductSKU']));
  }

  searchProductCodeExists(name: string): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query searchProductCodeExists($name: String) {
            searchProductCodeExists(name: $name) {
              status
              value
            }
          }
        `,
        variables: {
          name,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['searchProductCodeExists']));
  }

  addProduct(productData: IProduct): Observable<IHTTPResult[]> {
    const addProduct = this.apollo.mutate({
      mutation: gql`
        mutation addProduct($productData: ProductDataInput) {
          addProduct(productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
      },
      context: {
        useMultipart: true,
      },
      fetchPolicy: 'no-cache',
    });
    return addProduct.pipe(map((x) => x.data['addProduct']));
  }

  removeProducts(productData: IDObject[], marketPlaceIDs: number[], marketPlaceVariantIDs: number[]): Observable<IHTTPResult> {
    const removeProduct = this.apollo.mutate({
      mutation: gql`
        mutation removeProduct($productData: [ProductIDInput], $marketPlaceIDs: [Int], $marketPlaceVariantIDs: [Int]) {
          removeProduct(productData: $productData, marketPlaceIDs: $marketPlaceIDs, marketPlaceVariantIDs: $marketPlaceVariantIDs) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
        marketPlaceIDs,
        marketPlaceVariantIDs,
      },
      refetchQueries: ['getProductList'],
      fetchPolicy: 'no-cache',
    });
    return removeProduct.pipe(map((x) => x.data['removeProduct']));
  }

  getVariantsOfProduct(productData: IDObject, marketProductIDs: number[]): Observable<IVariantsOfProduct[]> {
    return this.apollo
      .query({
        query: gql`
          query getVariantsOfProduct($productData: ProductIDInput, $marketProductIDs: [Int]) {
            getVariantsOfProduct(productData: $productData, marketProductIDs: $marketProductIDs) {
              variantID
              variantSold
              variantInventory
              variantStatus
              variantStatusValue
              variantAttributes
              variantUnitPrice
              productVariantID
              # ////:: marketplace functionality commenting now
              # variantMarketPlaceType
              # variantMarketPlaceID
              variantReserved
              variantImages {
                id
                selfLink
                mediaLink
              }
              productID
              ref
              # ////:: marketplace functionality commenting now
              # mergedVariantData {
              #   mergedMarketPlaceID
              #   mergedMarketPlaceType
              # }
            }
          }
        `,
        variables: {
          productData,
          marketProductIDs,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getVariantsOfProduct']));
  }
  getShopsProductVariants(filters: ITableFilter): Observable<IProductList[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getShopsProductVariants($filters: ProductFilterInput) {
          getShopsProductVariants(filters: $filters) {
            id
            name
            status
            statusValue
            sold
            inventory
            reserved
            maxUnitPrice
            minUnitPrice
            variants
            totalrows
            images {
              id
              mediaLink
            }
            variantData {
              variantID
              variantSold
              variantImages {
                id
                mediaLink
              }
              variantInventory
              variantReserved
              variantStatus
              variantStatusValue
              variantAttributes
              variantUnitPrice
              ref
              productID
            }
          }
        }
      `,
      variables: {
        filters,
      },
      fetchPolicy: 'no-cache',
    });
    const returnValues = query.valueChanges;
    return returnValues.pipe(map((response) => response.data['getShopsProductVariants']));
  }

  getProductByID(productData: IDObject): Observable<IProductByID[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getProductByID($productData: ProductIDInput) {
            getProductByID(productData: $productData) {
              id
              name
              code
              description
              weight
              ref
              images {
                id
                mediaLink
              }
              dimension {
                length
                height
                width
              }
              dangerous
              status
              tags {
                mainID
                id
                name
              }
              categories {
                mainID
                id
                name
                subCatID
              }
              variants {
                variantID
                variantImages {
                  id
                  selfLink
                  mediaLink
                  bucket
                }
                variantInventory
                variantSKU
                variantStatus
                variantAttributes {
                  id
                  name
                }
                # ////:: marketplace functionality commenting now
                # variantMarketPlaceMerged {
                #   marketPlaceVariantID
                #   marketPlaceVariantType
                #   marketPlaceVariantSku
                # }
                variantUnitPrice
                variantReserved
                productID
              }
              # ////:: marketplace functionality commenting now
              # marketPlaceProducts {
              #   id
              #   name
              #   active
              #   pageID
              #   productID
              #   marketPlaceID
              #   marketPlaceType
              # }
            }
          }
        `,
        variables: {
          productData,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(map((x) => x.data['getProductByID']));
  }

  updateProductMain(id: number, productData: INameValuePair[]): Observable<IHTTPResult> {
    const updateProductMain = this.apollo.mutate({
      mutation: gql`
        mutation updateProductMain($id: Int, $productData: [ProductNameValueInput]) {
          updateProductMain(id: $id, productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductMain.pipe(map((x) => x.data['updateProductMain']));
  }

  updateProductTags(id: number, productData: IEditProductTag[]): Observable<IHTTPResult> {
    const updateProductTags = this.apollo.mutate({
      mutation: gql`
        mutation updateProductTags($id: Int, $productData: [ProductEditTagInput]) {
          updateProductTags(id: $id, productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductTags.pipe(map((x) => x.data['updateProductTags']));
  }

  updateProductCategories(id: number, productData: IEditProductCategory[]): Observable<IHTTPResult> {
    const updateProductCategories = this.apollo.mutate({
      mutation: gql`
        mutation updateProductCategories($id: Int, $productData: [ProductEditCategoryInput]) {
          updateProductCategories(id: $id, productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductCategories.pipe(map((x) => x.data['updateProductCategories']));
  }

  updateProductVariants(id: number, productData: IEditProductVariant[]): Observable<IHTTPResult> {
    const updateProductVariants = this.apollo.mutate({
      mutation: gql`
        mutation updateProductVariants($id: Int, $productData: [ProductEditVariantInput]) {
          updateProductVariants(id: $id, productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductVariants.pipe(map((x) => x.data['updateProductVariants']));
  }

  updateProductMainImages(id: number, storedImages: IMoreImageUrlResponse[], productData: IEditProductImages[]): Observable<IHTTPResult> {
    const updateProductMainImages = this.apollo.mutate({
      mutation: gql`
        mutation updateProductMainImages($id: Int, $storedImages: [ProductImageInput], $productData: [ProductEditImageInput]) {
          updateProductMainImages(id: $id, storedImages: $storedImages, productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        storedImages,
        productData,
      },
      context: {
        useMultipart: true,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductMainImages.pipe(map((x) => x.data['updateProductMainImages']));
  }

  updateProductVariantImages(id: number, storedVariantImages: IProductVariantImageChange[], productData: IEditProductVariantImages[]): Observable<IHTTPResult> {
    const updateProductVariantImages = this.apollo.mutate({
      mutation: gql`
        mutation updateProductVariantImages($id: Int, $storedVariantImages: [ProductStoredVariantImageInput], $productData: [ProductEditVariantImageInput]) {
          updateProductVariantImages(id: $id, storedVariantImages: $storedVariantImages, productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        storedVariantImages,
        productData,
      },
      context: {
        useMultipart: true,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductVariantImages.pipe(map((x) => x.data['updateProductVariantImages']));
  }

  removeProductTags(productData: Array<IDObject>): Observable<IHTTPResult> {
    const removeProductTags = this.apollo.mutate({
      mutation: gql`
        mutation removeProductTags($productData: [ProductTagIDInput]) {
          removeProductTags(productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return removeProductTags.pipe(map((x) => x.data['removeProductTags']));
  }

  editProductTag(id: number, name: string): Observable<IHTTPResult> {
    const editTag = this.apollo.mutate({
      mutation: gql`
        mutation editProductTag($id: Int, $name: String) {
          editProductTag(id: $id, name: $name) {
            status
            value
          }
        }
      `,
      variables: {
        id,
        name,
      },
    });
    return editTag.pipe(map((x) => x.data['editProductTag']));
  }

  addProductMultipleTag(name: string[]): Observable<IHTTPResult> {
    const addProductMultipleTag = this.apollo.mutate({
      mutation: gql`
        mutation addProductMultipleTag($name: [String]) {
          addProductMultipleTag(name: $name) {
            status
            value
          }
        }
      `,
      variables: {
        name,
      },
    });

    return addProductMultipleTag.pipe(map((x) => x.data['addProductMultipleTag']));
  }

  removeProductCategory(productData: ICatSubCatHolder[]): Observable<IHTTPResult> {
    const removeProductCategory = this.apollo.mutate({
      mutation: gql`
        mutation removeProductCategory($productData: [ProductCategoryHolderInput]) {
          removeProductCategory(productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return removeProductCategory.pipe(map((x) => x.data['removeProductCategory']));
  }

  removeProductAttribute(productData: ICatSubCatHolder[]): Observable<IHTTPResult[]> {
    const removeProductAttribute = this.apollo.mutate({
      mutation: gql`
        mutation removeProductAttribute($productData: [ProductCategoryHolderInput]) {
          removeProductAttribute(productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return removeProductAttribute.pipe(map((x) => x.data['removeProductAttribute']));
  }

  crudProductCategory(productData: ICatSubCatHolder[]): Observable<IHTTPResult[]> {
    const crudProductCategory = this.apollo.mutate({
      mutation: gql`
        mutation crudProductCategory($productData: [ProductCategoryHolderInput]) {
          crudProductCategory(productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return crudProductCategory.pipe(map((x) => x.data['crudProductCategory']));
  }

  crudProductAttribute(productData: ICatSubCatHolder[]): Observable<IHTTPResult[]> {
    const crudProductAttribute = this.apollo.mutate({
      mutation: gql`
        mutation crudProductAttribute($productData: [ProductCategoryHolderInput]) {
          crudProductAttribute(productData: $productData) {
            status
            value
          }
        }
      `,
      variables: {
        productData,
      },
      fetchPolicy: 'no-cache',
    });
    return crudProductAttribute.pipe(map((x) => x.data['crudProductAttribute']));
  }

  addProductAttributeManage(attributeData: IProductAttributeList[]): Observable<IHTTPResult> {
    const addCategory = this.apollo.mutate({
      mutation: gql`
        mutation addProductAttributeManage($attributeData: [ProductAttributeInput]) {
          addProductAttributeManage(attributeData: $attributeData) {
            status
            value
          }
        }
      `,
      variables: {
        attributeData,
      },
      fetchPolicy: 'no-cache',
    });
    return addCategory.pipe(map((x) => x.data['addProductAttributeManage']));
  }

  sendProductToChatBox(audienceID: number, PSID: string, ref: string): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query sendProductToChatBox($audienceID: Int, $PSID: String, $ref: String) {
            sendProductToChatBox(audienceID: $audienceID, PSID: $PSID, ref: $ref) {
              status
              value
            }
          }
        `,
        variables: {
          audienceID,
          PSID,
          ref,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['sendProductToChatBox']));
  }

  addProductVariants(addVariant: IProductAddVariants): Observable<IHTTPResult> {
    const addVariantMutate = this.apollo.mutate({
      mutation: gql`
        mutation addProductVariants($addVariant: ProductAddVariantInput) {
          addProductVariants(addVariant: $addVariant) {
            status
            value
          }
        }
      `,
      variables: {
        addVariant,
      },
      context: {
        useMultipart: true,
      },
      fetchPolicy: 'no-cache',
    });
    return addVariantMutate.pipe(map((x) => x.data['addProductVariants']));
  }

  getAttributesByProductID(id: number): Observable<IProductAttributeList[]> {
    return this.apollo
      .query({
        query: gql`
          query getAttributesByProductID($id: Int) {
            getAttributesByProductID(id: $id) {
              attributeID
              attributeName
              subAttributes {
                subAttributeID
                subAttributeName
              }
            }
          }
        `,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getAttributesByProductID']));
  }
}
