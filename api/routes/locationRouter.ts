import { Elysia, t } from "elysia";
import verifyToken from "../middleware/verifyToken.ts";

const locationRouter = new Elysia()
  .post(
    "/location",
    async ({ jwt, cookie, set, body, locationCtrl }) => {
      const userId = await verifyToken({ jwt, cookie });
      if (!userId) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      return await locationCtrl.addLocation({ set, body, createdBy: userId });
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .get("/location", async ({ locationCtrl }) => {
    return await locationCtrl.getAllLocations();
  })
  .get("/location/:name", async ({ locationCtrl,name }) => {
    return await locationCtrl.findLocation(name);
  });

export default locationRouter;
