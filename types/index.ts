import {
  Between,
  Book,
  Interest,
  Lines,
  Thanks,
  ThanksRequest,
  UploadedImage,
  User,
} from "@prisma/client";

export type SafeBook = Omit<Book, "id" | "createdAt"> & {
  //getSearchedCiniiBooks.tsのエラー回避のためidとcreatedAtを除外
  id?: string;
  lines?: SafeLines[];
  betweens?: SafeBetween[];
};

export interface SafeLines extends Lines {
  book?: SafeBook;
  betweens?: SafeBetween[];
  user?: User;
}

export interface SafeBetween extends Between {
  user?: User;
  lines?: Lines;
  uploadedImages?: UploadedImage[];
}

export interface StripeAccount {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export interface SafeThanks extends Thanks {
  user: User;
  opponentUser: User;
}

export interface SafeThanksRequest extends ThanksRequest {
  user: User;
  opponentUser: User;
}

export interface BookResults {
  results: SafeBook[];
  count: number;
}

export interface LinesArrayResults {
  results: SafeLines[];
  count: number;
}
