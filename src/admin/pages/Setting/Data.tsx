export const tabs = [
    { name: 'From This Device', value: ['file'] },
    { name: 'From the Web', value: ['url'] },
    { name: 'Both', value: ['file', 'url'] },
  ];

export const markup = `
    <br>
    <h6> Dear @name, </h6>
    <br>

    <p>Unfortunately, due to some reason, your account opening application has been rejected.</p>
    
    <br>

    <p>Please contact to support team for any query.</p>
    
    <br>

    <p>Thank you.</p>
    
`;

export const markupAcceptedEmail = `
    <h6> @name, </h6>
    <br>
  
    <p>Your application has been accepted and is currently being processed by our team.</p>
    
    <br>

    <p>Please contact support with any questions <a href="https://www.mailinator.com/v4/public/inboxes.jsp?to=dev5" target="_blank">test</a> or concerns:</p>
    
    <br>
     
    <p>Phone: +1(888)-602-0092</p>

    <br>

    Email: <a href="mailto:info@guardiantrading.com" style="">info@guardiantrading.com</a>

    <br>

    <br>

    <p class="MsoNormal"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI8AAAAuCAYAAAARI0rYAAAYIElEQVR4Ae1cB1dUSdreX7I7O86YZ8xZUZEkwQSDWcE4KCqYFRUddQyoYEAFTIgSBhWRUQQUJdPknHNoguSMoM93ntKLdNsoOu4uc76uc+rcvvdWeO9bT72x4B9QFzUHvpID//jKfupuag5ADR41CL6aA2rwfDXr1B3V4FFj4Ks5oACeN2/eoKqqFvKKGpSVv0J5eQ3K5bUoLa9FmbwepfJ6FJXWoaisAYVljSgofXfNL29EXmkj8soakFfehDx5M/IrWpAjb0F2RQuyK1uRIW9BWnkz0uQtSC5vQZK8BYnyFmRVt+F199uv/gB1x/8dBz4CT2xqASwcgzHX1hfae7yhZe0OzU1umL3eFTPN3KCx0h0aKz0xc7UXZq31xhwLH2hv9cPcnf4w2h8E46MhMDkZiV/ORMPEPgaLzsdi0aV4LLqShIXOKZh/LQ2GNzJgdCsTC1wzscI9B04RFahv7e6TC80d3fAPS0VFVV2fbdQv/vscUAAPp6cMKG/sxJUoOZbezYKOSyq0nFKg7ZQCrSvJmHMpCZrnE6B1Lg7ap6OhcyICukfDofdbGAyOhsHweASMTkTC8GQUDE9FQ99Ohrnn4qB3IQG6jsnQdkqF7rV0GN3MhOmtTKy5m40d9/PhFl2F6qZOMb/EhvauN4goaoK1dxpOX3uC5uY26ZX6OgA48BF4JJq63r5FSUMHbsZVYc29PBi5ZkH3RiZ0XNKh45QCvctJ0L+UAIPz8TCwj4GBXbQAjMHxcOgfCcVcm+fQ3hWAWdseY9rmR5iy0QdTNvhg8nofTN7gg5mWjzB3559YfCQQFvah+O12HDyeZaNYXoc3b96irq0L9uEVmH8jFZqbryMju0QiTX0dIBzoEzwSfd1v3qK2tRMZ1W3wTa/DmZdl2HYvB+au6VjmnAxTxwSYnI+F8RkZFpyMhOHhl9DdEwhN6yeYbuGLKWvvYcIKD4z9xQ2j5t3ESD1njNC8hOEadhg69QiGTNyLweOtMWTsZkyebY2AZ3HIqmrF5ocF0L+ZCY19vrh0/Sk6O7skktTXAcKBz4KHdEbGZOPIcTf4+UejsOwV6lo6hYqR13eguKYNBVWtyK1oQUZJI5Ly6yDLqEZocgUCZaXwCy2Ad2AO3HzTcM0rCZduxsDu8kscO+uPJWsu4cfRlvhu+BrM1N2BJwHRkBXWw9K3ELrXMzD7dASWWN1CaXnNAGGXmozeHOgXeCLSq6BtfAzDx66HtsFu2By+jmfBcZDLa/D6df8kwtu3b4U6okrq7n6L7NxyGJkew/fDzWCwcD+iZOnIrGjGZp8CARzaRlPXuMLrYQzYV10GHgf6BZ77ca9gdSYQg0ZtwnfD1+KfQ1fhh5GroaG1FXsPXEVUdCo6Ojr7/XUtre3YsvMqvhu6AouWHEJaRhHqW7uw27cAei5p0LmegWm7A7DZ5gFqalv6Pa664X+XA58FT1f3W5wMKMFujwyM0zmOH8ZYY5a+LVasO4vZersxauIGjBxvDl2D7dh34CoCgmSoq2vs8ysYSzp26i6GjzWHpZUDCovk6HjdDefQMsy7mgJd5zTMspNhookrwmSFaqnTJyf/9y8+C5661i5Yeudjo0cO5u31w7Bpv2GuqQOycytQWFyFuIQc+D2OguNVH+w76AxLq3PYY+OIG7ceITYuAzU19SBgWLq738D7wUtM0rDA/kPOqHoft4krbMRylxTo05W/mIgpFr6wPReC5pYP0qyjowNxsbEIDwtHXe2n4z3t7e1ITEhAaGgoqquq3s/djfLycjEGn4eEhKisHL+5uRkcIyE+HlGRkWhs7HszKC8hVWxDQwPSUlMR/Pw5fB8+xP1798T1WWAQUpKTUVtbq3JTtLW1IS8vD9GRUQh5qZo+0p2UmIiuri4xTlhoGDLS09HZ2YkYmUzlN6n61syMDCQmJor2/MbW1lblTxH3/J7MzEzRLiwsTMwpNfwseGpau7DaMwfGtzKx5Foqxs53wciZp3HVNQJd3e9AIQ1GcLS0tKGyshaZmYVISMxCanoeamobBIAio9IwY85mXHD0RmPjO3XU0PIaB+9lw9AhHvqXkjBz/3MYbPJBfkmDNKy4Ejw7rKwxdtRoODs5gfd9lZjoaMyZNRuzNWYiPS0NTU1NcHF2hpG+PsaPHoOfR4zss04ePwHp6emQy+VYamqKWTM0xGL1NVfv5wSc/5MnWLl8BaZOnISfho/A8MFDeurPw0dg0vjxWLZ4Mby9/kB724e4lby8HAf278fsGRoY89PPgj72V66kneM3NTYi5OVLjBs9BtZbt6Gm+hX0dfUwauRPClX6VuXntgcP4barKyaMGSt4cs3FBd3dHwdqCXZdbW2MHvkTLC02fRl4yJzL0ZWYeyNTRIY1djzFSB0nzDa9ieIyxQVm27a2drErJKZKxm5GZhGWrDgEL+9naG9/J1HevH2LO2GlWGgfK8CjezIK0399iKt/JIPvlEuAvz/G/DwKmhozkZ2Vpfxa3L9+/Ro2e/dhyKAfcPTIEbGj3O/cxYghQzFy6DAsW7wEO6y3Y9eOnSqrzb79KCsrE3WBoZFgbkJcvMq5lB96e3mJhRj6w49YYDQPtgcP4qLDeVy+5IgLDucFPabGJoKWsT+PwnUXF8ErSrbdO3YKmseNGo3VK1bActNmbNlsqbKeO3MWlFLPnz3H0B8HY9PGX9HS0gIXJ2ecszvTU/ft2Ythg4dg4rjxOHn8957nbBMUECh4c/H8eZBebqqHPg8VPqmurg7zDI3ww3f/hvGCBWJD9W7wWcnDxqUNnVjrnQttlzRoXUzE+GUeGGN0AxddY/G6S1H6vHpVj9zcEgWxTMlz/OQtPPaPUDCsc8qbsO5yPAxPy0QkWnNXANYeDUZJRVNvGnt+19XWYsPadYLJFxwcQKAol+jISGhMmy52PlVXQ30D1pqZ48d/fw/Hi5dQXVUt1BJVk6rKRaCaJYC+BDwN9fVYtWKFAAYXqqSkRCwOJSRVCq9c8MqKCjhevCiAbKCrJxaEKo6gmTR+Avx8H4GLRkCpqpSiVDHclL3Bw3sxV0cnOjs60dHegeSkZLHZ5uroConB51Kl2mNpbGjA4UOHhHTUnDkLaalp4jlV62YLC8Frk4WLkJOdrczq/p3nIWGPM2ph4JwKHZc0zNj7DONM72COuReyCxXtD6ojJ5cHPdKFUsbDMwAxsekKYrG+uROHbidj/u8R79IYR0KhZf0EvqGFwjb6iNL3D54/eyYYPVdHB7k5OQrNqAZ2bd+OYT8OxqEDB4RaKCwohL6Orthdp0+egqe7xyer36NHYnG+FDw5OTmYOX0GZk2fgaKiIgW6lG+KCgtB4FAVJCQk4FlQkNjdi01+QX2dIj+V+0r3qsAjvZOuGekZAjxUZ9wUfRWCdd/uPQIoC+fNF3YZNwA3nIHe3D7Vdr8kDydtau/GFq8c6F9Ohs65WExeex8Tlnvgwt1EBelDvXnA9gqKiirE7sjILEBZWZWCJOJ4jyJKYGjzHIbHwmB0Igr6B4Ox+2oMahv7tmUEHU1NWGtmJj6UIpdMlAoN6ikTJmLG1GnC2OXzrKwsYf8M+td3GPz9INGPKq2vSjupQi7/YsmTkpQs5jbUmwtKoU+VV69eYeWy5RgxdBgiwiPwyNcXpG/NajMB3E/1ld59S/BwzMrKSqH+qKIoqYYPGSpUWWxMjDTlR9d+g4c9k0qbsNgpGfoXEzDHJhhTN/jAaPufyCxS3C133P1x78ELEUBsbf1gFEqzZ5fUY9WxFyKNYXgsHPNORGLxyQgk5NaIQKLUTtWVTKPXMnHsOOhpa6P4/S7nztq+zUoA5LCtbY9BXZBfAD0tbSGNTv5+Anfd7nyyPnzwQCwgPTPuQhqkMdEyVaQoPMvOzhZSh5KnuLhY4Z3yDWk2nKsvDNv4+HgEBQYKybPkF1PhqSm3V3X/rcHDOfjNVNUE8oSx4/DyxYseT1kVDV8EHp67sfMvgJFDHPTPyDBnx1PMtPTDSbdEdL7+YPskp+TCYssZNDR8LCppI/12LRazt/hBZ3cgDE9EYd7JKNg/zEZb58fWviqiW1taYbHxV6GnKX0InIjwcGEYTp00CTLZh8WmFDBftVqI4KuXL6OmpkYAi/aBytreIaQZdf6aVasF6JyvOgk7hDZLX5Xtly9ZKmwe+7NnxU6mTcZFlqrkXrs4OeGnYcOhM0dLSLiU5BThYU2ZOAlP/f2FrdPXPHxOuv8T4OGYXh6eglcrly37JHC4Ll8EHnYofNWGdc7JMDgTA/0jIQIAxgefI6ukUXwQ29TVN2GO7jbQNe9dmJp4LiuB9iYfzNj0CLqHQ2BgJ8PaKwnIq/gYaL37Kv8OePpUiFV6EocOHITpImOhio4fPaqg38mQu7fdxGJRilA17N65C3t371FZORbtHS78dZdrGDViJCaMHQuzlauwbctWWG3d9lG1PXAQFRUV8PLwEN7ZyGHDsWLpUhw5ZAuHc/bCUD9v74CjR34T49DTEiGHq05iHsaFdm3fIYA6ffIU4RSomkd6Zn/unJCOygazMo/6a/P07hf8PFhIbzomnytfDB4OeF9WjgV2MhidioLhkVBhrxy9k4zWjncWPPNd80324vCxWwrGr7yqGSZWjzBxhRdmbfeHvn0cjM7Fwi28FF1vPtgunyOa7xlTsTt1SoBi0Hf/FsBZtXx5jxrrPQa9qiuXL0NrtqaQVj9+/71gEG0g5Uqw0Pth4aKePXNGxItohCu3le6nT5mKvNxcIRH+9PODqYmJMIZpcFIFsNKW4D1jPYvmL4D73buivUQnVcaenbswecJEYdwPHvQxbdJ8pia/iDgPg5C0mxh/UVUyMzLFBqOK/JTB3Lvvi+BgMb/Fho29H6v8/VXgqWnqhPW1JBj9HiHsFYNj4Vj4ezjict/ZPnR1rXaeh968vaiqfmc88kjFuWsyjDe+jYlm3tA5EQmDiwnY6paO0tqP7SKV1Co9pCsbGhICD3d3PPbzEzqbkkZVoagvLCxEZESEsDECAwKgqgY/e6YQUSZIC/LyhVoM6qNP6MuQnsWhw8CoNqPTj/3+hMddd9y+5SrAQjecBiillKowA93wzPR0hLx42SeNtI9iZTEiPvSquhr0PpOSklR9sgiOEgyMIKsKAKrqRGOecyQmJKp6rfDsq8DDEWRZNTA5Fvru9OBpGQxOROL4/Wy0vJc+Ttd9MXyMOR49jhbqLDgiDxomtzB6/i1o2ARD73Iy5jsmIjC9BjwzNBAKgde7DgSaBjINXw2ejtdvYHszAXp7g2BwIgoGZ2Ng7BCL6Lx30ic8MkWAx3yjPSqrGrBuu6c4BDbR7B60HJOh55SC3Q9yUNfycaDvSxnGXBfddEohhuxZI9/npLjj6P1wV6sqBAsDen5+fvC4c7enMh7E/E9vSUYpxDxSVmamwk6mFElPSxfShhKHldKgqrKypz9dYQYIWUgvpUd+fr4Yh1IxNSW1R3oxqFhaUiLUZ1pKCkRNTUXV+zyd8ndQ0vMbKYlVFRrZ2VnZCpH/3u04f0FBwbt5es3XV75L6vvV4OEAeeWNMLYJhNa+IOg7xMHQPg6HHuSgrfMNKqvqMG22JX6atBnW++9g9OzfMdrQGTpnY6FzLR2Lb2ciqaxZZRpCIq4/V+py5nYYYNu4fgN+3bBR1O1WVoIhjDBbb7MS8RRV41GFLDNdLDyyfbt2Q6oH9u1H6MuXPYtPgLjecgXdaeamAp8G9HgjBIbxgoVijK2WW0RKYZ35Gqw1N0d+Xp5od8XxMi5euCB+UzXOnDYdxvMXiOSkvKxM5NEyMjKEOvPy9MRCo3nCe1uxdBlYV69YKZKrqr6BPNizazdeBL9Q9RoMI3A8qjnlQuCcOXVapFOkuXilh5qbk6vcXOH+L4GHu/LKvVRoWPhCl6rrUiKMLychPK9eHBtduuoo/jXMHEMn7MCIGccwd+9TLLiRIQ57OYSWo0MptaFAWT9vkpOSRMCNoXgauFJIn5KGUqe+rh40/pilVlXCw8JEOuPShYu45+0tMuDMgj/08QGj01JheJ55KdoD9/7whvnq1UKy8D0BuNjYRKQLSktLhSQjXVwAX5+HAjAX7B1gZ2cnfjOvRLee+a6D+21E6H/R/PlIS0sDbQ56dg/u3RfufnV1NVgr5BV9Sk+Ch55gUGCQRK7ClZJSW3OOGEfhxXva+Y62EyWbNB/tNlV2We/+fwk8HKisqhlL9/pDY0cA9ByTxLGKXQ9y0dTeBdujN/GvYavxwxgraJndgPnNdCy6lQkz7zzx91q9Cfna3zy+sH7NWmEsqxqD4GHisK9dydTA+DFjscbMXHgt9FxYd1hbIyoySkgeqhGCy2iuPjw9PIQBPGfmLDy4f1+AgeChR8PYE5OyrL+u3yAAwhQK1YoyeJhvo1SiRHG/cwcSeBjdXmxigtSUFIXPIchp7KsqBI/V1q146v9U1WuRRNbRnCPAqNyA6k57tqZKL1W5rfL9XwYPB3wcko8py9yhaScTf1kxzyUNKfIW3PEIwqAR5hineRDW1+Nh4ZWLxbez4J1S88WuuTLh0n1ZaanY9Ux6BjwN6KmMV9TX14ugHmMojP9ER0WBGXJW2i4U2VQVulrauHn9BiIjIgVgCBpZVHRPFpkpDlNjY2yz3CKy38yAb1y3HlRNPLpB8PyycJGQFkkJiWA9deIkrLdtE4lIgodxHrvTHyQPwcP5GUKgytXX1RWSh9Jz868WYB6OkW2J3v179+KKo6P02QpXjvOb7WGRn5JFR/f04XEKJkhLiktEiuYPT0/Ex8b1vGekm0FT5v54zKX3O9ptBOWnyjcBT2NzB9bv88c0qyfQdk6D7rU03I6rQkh4KsZMtcT+C89wLqAY51/I8Ti9Fg3t/Tv3/CnCpXdUnYzKUudvttjUU3nkgq45Cw9J0S5aY2YmgoQMFB60sREZdjLe091dSAqqC/P3dZ2ZOZ48fiykBl1uHmNgvIjtWaleuGCUCFyAI7a2yM/Ll8hCUWGRCBLSbiCNnh6eIi3C34yAHz92TBiwjO8wq71m9WphoxFosTGxoO1EgJFW1pVLlwmV2jOB0g9Kqm1b2OfDN9LWq6yoFFl92lEb163rGY9j37pxU6h2nkGidJbm4pWbg6mdT5VvAh5OkJRRCa3V7tA8GyPOIFv5FSI9vxJHTnkiJqcWBa/awb/8JPP+E4WqpXdInxl2LoRU6Ckxe8w0AmtjQ2PPe9JEYPR+z98d7e2iO72ONhU5OvbhuOzf0tyi4IFJYxJoLO1t7T1jkNbe3h/HYDa9dyyG8ynTwzE+VThX7z6UYhIPSA/nlL6f196Shb97v+M40rGNvub8ZuDhBMftAzFtywPhTS1yy0ZeTRta2zoU/gq0L0LUz/9+HPim4Ckuq4XhOhdoXoiD3o0MRJc0//04oqa43xz4puDhrHf+iMD0bV7QcU7F40zFoxr9pkrd8G/Bga8CD/Uni3SVfvO++lUDFls4Yo5DNLySa6Bs4vTu87fgkJrIPjnQL/BIC84rKw277q4uEURiIImGGo0+VhqXwSEJ0La5D1dZeY8Ry3c0QNmWfdifBhnHksaV5umTWvWLAcWBT4JHAgq9A8YLaJHTgq+tqRXR1fKyMhQXFQuXjmd4eQQgLTUNifFJWLPLEecfRCElJQU8V8J3Odk5wh0tKS4G+1ZVVoGH2ukF8IAX5+BcBJTkJQwobqmJUeCASvBw4bq7uoWUEICpr8erav6nsHIRss/KzALD7wxihYaEIjAgEI98H8H7D2+4ud3BNZfrsD18GjZHzuLG9Zu443YX97zv40+/PxEU9AzhoWEilsHYBMP+PDDOYFttTY1IL1B68ZS/JJUUKFbfDBgOfAQeShuChyqFKoaxDEZqmevgCTsGjihF+FeLUVHRIuzv/8QfD+77wP2uB65fv4krV5xw4fxFXLhwCVevOuHWTVd4uHuKvwtiFDjkZShiZDECgMy7FBYUgH/0xsQdJRtjJpybNEgqbcBwTE1IDwc+Ao/0RhlEDMAx6chAEoFEKUSJwfwMAcAjCZQklEgMbcfHvavieEJikjhywL/epKQpyM8XIXN5uVwk4hggo+qiXSTUVtc7tUUa1GXgcqBP8CiTLIHpnUrrQtfr1z1/zMZFb2ttFTZRi/THdE3NaGZtbhaSRERp29oEQITR3PlaSJY33W+EpFNLGGWOD/z7foPnSz9FAoN0/dL+6vYDnwP/MfAM/E9XU/hXOaAGz1/l4P/j/v8HFrdSq8NXlgIAAAAASUVORK5CYII=" data-filename="image.png" style="width: 143px;">&nbsp;<img src="data:image/png;base64,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" data-filename="image.png" style="width: 162px;"></p>
`;