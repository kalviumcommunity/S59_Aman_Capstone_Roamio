import React from "react";
import { FormHelperText } from "@mui/material";
import Image from "next/image";
import ArbutusSlab from "../../../../public/fonts/Arbutus_Slab";
import styles from "./GenderInput.module.css";

function GenderInput({ register, error }) {
  return (
    <div>
      <div id={styles.genderInput} className="flex_row_center">
        <input
          type="radio"
          name="gender"
          id="male"
          value="male"
          className={styles.inputHidden}
          {...register("gender")}
        />
        <label htmlFor="male">
          <div>
            <Image src="/maleVector.png" alt="male" height={120} width={110} />
            <p className={ArbutusSlab.className}>Male</p>
          </div>
        </label>
        <input
          type="radio"
          name="gender"
          id="female"
          value="female"
          className={styles.inputHidden}
          {...register("gender", { required: "Please select your gender" })}
        />
        <label htmlFor="female">
          <div>
            <Image
              src="/femaleVector.png"
              alt="female"
              height={120}
              width={100}
            />
            <p className={ArbutusSlab.className}>Female</p>
          </div>
        </label>
        <input
          type="radio"
          name="gender"
          id="others"
          value="others"
          className={styles.inputHidden}
          {...register("gender")}
        />
        <label htmlFor="others">
          <div>
            <Image
              src="/othersGender.png"
              alt="others"
              height={120}
              width={110}
            />
            <p className={ArbutusSlab.className}>Others</p>
          </div>
        </label>
      </div>
      {error && <FormHelperText error>❗{error.message}</FormHelperText>}
    </div>
  );
}

export default GenderInput;
