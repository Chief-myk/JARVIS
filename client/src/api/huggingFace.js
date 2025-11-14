
export const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;


// Simple and reliable image generation with working models
export async function query(prompt) {
  try {
    if (!prompt || prompt.trim() === "") {
      prompt = "A beautiful landscape with mountains and lake, digital art";
    }

    // Try multiple working models
    const models = [
      "stabilityai/stable-diffusion-xl-base-1.0",
      "black-forest-labs/FLUX.1-schnell",
      "dataautogpt3/OpenDalleV1.1",
      "wavymulder/Analog-Diffusion"
    ];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            headers: {
              Authorization: `Bearer ${HF_TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                width: 512,
                height: 512,
                num_inference_steps: 20,
                guidance_scale: 7.5,
              },
            }),
          }
        );

        if (response.ok) {
          const result = await response.blob();
          console.log(`✅ Success with model: ${model}`);
          return result;
        } else {
          console.log(`❌ Model ${model} failed with status: ${response.status}`);
          continue; // Try next model
        }
      } catch (error) {
        console.log(`❌ Model ${model} error:`, error.message);
        continue; // Try next model
      }
    }

    throw new Error("All models failed. Please try again later.");

  } catch (error) {
    console.error("❌ Image generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

// Simple image modification function
export async function modifyImageAlternative(imageUrl, prompt) {
  try {
    // For now, let's use regular image generation as fallback
    // since img2img models are less reliable
    const modifiedPrompt = `${prompt}, high quality, detailed, professional artwork`;
    return await query(modifiedPrompt);
    
  } catch (error) {
    console.error("❌ Image modification error:", error);
    throw error;
  }
}

// Utility function to convert image to base64
async function imageToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}