import type { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { propertyCreateSchema } from "../lib/zodSchemas";

class propertyController {
  async get(_req: Request, res: Response) {
    const { data, error } = await supabase.from("property_data").select("*");

    if (!data) {
      res.status(400).json({
        success: false,
        error,
      });

      return;
    }

    res.json({
      success: true,
      data,
    });
  }

  async getById(req: Request, res: Response) {
    const propertyId = req.params.propertyId;

    const { data, error } = await supabase
      .from("property_data")
      .select("*")
      .eq("id", propertyId);

    if (!data) {
      res.status(400).json({
        success: false,
        error,
      });

      return;
    }

    res.json({
      success: true,
      data,
    });
  }

  async post(req: Request, res: Response) {
    const { success, data, error } = propertyCreateSchema.safeParse(req.body);

    if (!success) {
      res.json({
        success: false,
        error,
      });
    }

    const { data: dbData } = await supabase
      .from("property_data")
      .insert([
        {
          name: data?.name,
          status: data?.status,
          price: data?.price,
          available_shares: data?.availableShares,
          location: data?.location,
          type: data?.type,
          image: data?.image,
          attributes: data?.attributes,
          value_parameters: data?.valueParameters,
          updates: data?.updates,
          growth: data?.growth,
          description: data?.description,
        },
      ])
      .select();

    res.json({
      success: true,
      message: "Created new properties.",
      data: dbData,
    });
  }
}

export default new propertyController();
