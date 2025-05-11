/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as jwt from "jsonwebtoken";

import { generateToken, JWT_SECRET_KEY } from "../../src/utils/jwt";

jest.mock("jsonwebtoken");

describe("generateToken", () => {
  it("debe llamar a jwt.sign con el payload y opciones correctas", () => {
    const mockPayload = { userId: 123 };
    const mockToken = "token-falso";

    // @ts-ignore
    jwt.sign.mockReturnValue(mockToken);

    const token = generateToken(mockPayload);

    expect(jwt.sign).toHaveBeenCalledWith(mockPayload, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    expect(token).toBe(mockToken);
  });

  it("debe funcionar con payload vacío", () => {
    // @ts-ignore
    jwt.sign.mockReturnValue("otro-token");

    const token = generateToken();

    expect(jwt.sign).toHaveBeenCalledWith({}, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    expect(token).toBe("otro-token");
  });
});
