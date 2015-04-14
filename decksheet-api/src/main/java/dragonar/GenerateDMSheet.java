package dragonar;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.IOException;
import javax.servlet.http.*;

public class GenerateDMSheet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        try {
            PdfReader reader = new PdfReader("decksheet.pdf");
            PdfStamper pdfStamper = new PdfStamper(reader, response.getOutputStream());

            BaseFont bf = BaseFont.createFont("HeiseiKakuGo-W5","UniJIS-UCS2-HW-H",false);

            PdfContentByte over = pdfStamper.getOverContent(1);
            over.beginText();
            over.setFontAndSize(bf, 10);
            over.showTextAligned(Element.ALIGN_TOP, "アクア・カスケード＜ZABUUUN・クルーザー＞", 80, 90, 0); //
            over.endText();
            pdfStamper.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

    }
}
