package myapp;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.*;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import javax.servlet.http.*;

public class DemoServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Document document = new Document();
        try {

            PdfReader reader = new PdfReader("decksheet.pdf");

            PdfStamper pdfStamper = new PdfStamper(reader, response.getOutputStream());


            BaseFont bf = BaseFont.createFont("HeiseiKakuGo-W5","UniJIS-UCS2-HW-H",false);
            Font font = new Font(bf,12);

            for (int i = 0; i < reader.getNumberOfPages(); ++i) {
                PdfContentByte overContent = pdfStamper.getOverContent( i + 1 );
                overContent.saveState();
                overContent.beginText();
                overContent.setFontAndSize(bf, 12);
                //overContent.setTextMatrix( xLoc, yLoc );
                overContent.showText( "世界Page " + (i + 1) + " of " + reader.getNumberOfPages() );
                overContent.endText();
                overContent.restoreState();
            }

//            document.open();
//            document.add(new Paragraph("おはよう世界", font));
//            document.close();
            pdfStamper.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"Prevention.pdf\"");
    }
}
