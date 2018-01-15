var Xray = require('x-ray');
var x = Xray();

// url                                class or tag or id etc.
x('http://prices.shufersal.co.il', 'table.webgrid tbody tr', [{
  link: 'td a@href',
  tags: ['td']
}])
  .paginate('tfoot tr.webgrid-footer td a@href') //i don't know how to get the link from the '>'
  .limit(5) //limit the number of pages (for some reason it seem to repeat him self after 40 record)
  .write('results.json'); // write the result to json file


  // <tr class="webgrid-row-style">
  //             <td><a href="http://pricesprodpublic.blob.core.windows.net/price/Price7290027600007-001-201801101430.gz?sv=2014-02-14&amp;sr=b&amp;sig=YHrvJXOl6nXr1cR5qtUDMCUTKg46WstHToegiStodo4%3D&amp;se=2018-01-10T14%3A05%3A42Z&amp;sp=r" target="_blank">לחץ להורדה</a></td>
  //             <td>1/10/2018 2:30:00 PM</td>
  //             <td>664 B</td>
  //             <td>GZ</td>
  //             <td>price</td>
  //             <td>1 - שלי ת&quot;א- בן יהודה</td>
  //             <td>Price7290027600007-001-201801101430</td>
  //             <td>1</td>
  //         </tr>
