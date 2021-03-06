package de.hsfulda.et.wbs.http.haljson;

import de.hsfulda.et.wbs.core.HalJsonResource;
import de.hsfulda.et.wbs.core.Link;
import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.core.data.KategorieData;
import de.hsfulda.et.wbs.util.UriUtil;

import java.util.List;
import java.util.stream.Collectors;

import static de.hsfulda.et.wbs.Relations.REL_KATEGORIE_LIST;

public class KategorieListHalJson extends HalJsonResource {

    public KategorieListHalJson(WbsUser user, List<KategorieData> kategorien, Long traegerId) {
        addLink(Link.self(UriUtil.build(REL_KATEGORIE_LIST, traegerId)));

        List<HalJsonResource> resources = kategorien.stream()
                .map(t -> new KategorieHalJson(user, t, false))
                .collect(Collectors.toList());

        addEmbeddedResources("elemente", resources);

    }
}
